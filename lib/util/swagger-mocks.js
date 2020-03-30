'use strict';

const Generators = require('../generators');
const ParamTypes = require('../generators/paramtypes');
const Querystring = require('querystring');
const OPERATIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

const mockSwaggerSchema = (api, options) => {
    let mock = {};
    let paths = api.paths;
    if (paths) {
        let pathObj = paths[options.path];
        if (pathObj) {
            //Found the requested path
            mockPath(options.path, pathObj, mock, options);
        } else {
            //Generate Mocks for all the paths
            Object.keys(paths).forEach(function (pathStr) {
                let pathObj = paths[pathStr];
                if (pathObj) {
                    let pathMock = {};
                    mockPath(pathStr, pathObj, pathMock, options);
                    mock[pathStr] = pathMock;
                }
            });
        }
    }
    return mock;
};

/**
 * Generate mock for the path
 * @param pathStr   The path key
 * @param pathObj   The path value
 * @param mock      The mock object
 * @param options   Options provided by user
 */
const mockPath = (pathStr, pathObj, mock, options) => {
    let opsObj = pathObj[options.operation];
    //Common parameters - A list of parameters that are applicable for
    //all the operations described under this path
    let commParams = pathObj.parameters;
    if (opsObj) {
        //Found the operation
        mockOperation({
            path: pathStr,
            operation: options.operation,
            commonParams: commParams
        }, opsObj, mock, options);
    } else {
        Object.keys(pathObj).forEach(function (operation) {
            if (pathObj[operation] && OPERATIONS.includes(operation)) {
                //Valid operation.
                let opsMock = {};
                mockOperation({
                    path: pathStr,
                    operation: operation,
                    commonParams: commParams
                }, pathObj[operation], opsMock, options);
                mock[operation] = opsMock;
            }
        });
    }
};

/**
 * Generate mock for the operation
 * @param resolved Object type:
 *  {
 *      path: string; // the path key
 *      operation: string // the operation key provided by user
 *      commonParams: Array<parameter> // If available, the parameters accepted by this operation
 *  }
 * @param opsObj    The operation code value
 * @param mock      The mock object
 * @param options   Options provided by user
 */
const mockOperation = (resolved, opsObj, mock, options) => {
    //Mock response
    if (options.mockResponses) {
        mock.responses = mockResponses(opsObj, options);
    }
    //Mock Parameters
    if (options.mockParams) {
        mock.parameters = mockParameters(resolved, opsObj, options);
    }
    //Mock Requests
    if (options.mockRequest) {
        resolved.consumes = opsObj.consumes;
        mock.request = mockRequest(resolved, mock.parameters || mockParameters(resolved, opsObj, options));
    }
};

/**
 * Generate a mock responses
 * @param opsObj    The operation code value
 * @param options   Options provided by user
 * @return {*|{}}
 */
const mockResponses = (opsObj, options) => {
    let mockResp;
    let responses = opsObj.responses;
    if (responses) {
        let response = responses[options.response];
        if (response) {
            //Found the response
            mockResp = mockResponse(response, options.useExamples);
        } else {
            mockResp = mockResp || {};
            Object.keys(responses).forEach(function (responseStr) {
                let response = responses[responseStr];
                if (response) {
                    mockResp[responseStr] = mockResponse(response, options.useExamples);
                }
            });
        }
    }
    return mockResp;
};

/**
 * Mock a response
 * @param response   The value of the response code content in schema
 * @param useExamples       boolean Whether to use examples presents in schema
 * @return Object           mock response
 */
const mockResponse = (response, useExamples) => {
    let mockResp;
    let schema = response.schema;
    if (schema) {
        mockResp = Generators.mock(schema, useExamples);
    }
    return mockResp;
};

/**
 * Generate a mock parameter list
 * @param resolved  Object type:
 *  {
 *      path: string; // the path key
 *      operation: string // the operation key provided by user
 *      commonParams: Array<parameter> // If available, the parameters accepted by this operation
 *  }
 * @param opsObj    The operation code value
 * @return {{}}
 */
const mockParameters = (resolved, opsObj) => {
    let mockParam = {};
    //Combine common parameters
    let parameters = mergeParams(resolved.commonParams, opsObj.parameters);
    if (parameters.length > 0) {
        //Iterate over each parameter
        parameters.forEach(function (param) {
            // `in` - The location of the parameter.
            // Possible values are "query", "header", "path", "formData" or "body".
            let paramType = param.in;
            if (ParamTypes[paramType]) {
                //Found the Mock generator for the param type (AKA `location`, AKA `in`).
                mockParam[paramType] = mockParam[paramType] || [];
                mockParam[paramType].push(ParamTypes[paramType].call(null, param));
            }
        });
    }
    return mockParam;
};

/**
 * Generates the mock request objects that can be used for tests
 * @param resolved Object type:
 *  {
 *      path: string; // the path key
 *      operation: string // the operation key provided by user
 *      commonParams: Array<parameter> // If available, the parameters accepted by this operation
 *      consumes: string[] // Array of content types that the endpoint consumes
 *  }
 * @param parameters
 * @return {{}}
 */
const mockRequest = (resolved, parameters) => {
    let mock = {};
    let queryObj = {};
    let headerObj = {};
    let formObj = {};
    let pathname = resolved.path;

    if (parameters) {
        //path
        if (parameters.path && parameters.path.length > 0) {
            parameters.path.forEach(function (pathParam) {
                if (pathParam && pathParam.name) {
                    pathname = pathname.replace(new RegExp('{' + pathParam.name + '}', 'g'), pathParam.value);
                }
            });
        }
        //query
        if (parameters.query && parameters.query.length > 0) {
            queryObj = parameters.query.reduce(function (aggr, queryParam) {
                aggr[queryParam.name] = queryParam.value;
                return aggr;
            }, queryObj);

            mock.query = Querystring.stringify(queryObj);
        }
        // Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be one body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
        if (parameters.body && parameters.body.length > 0) {
            mock.body = parameters.body[0].value;
        }
        //headers
        if (parameters.headers && parameters.headers.length > 0) {
            //Assuming only one Body for a request.
            headerObj = parameters.headers.reduce(function (aggr, headersParam) {
                aggr[headersParam.name] = headersParam.value;
                return aggr;
            }, headerObj);
            // `consumes` property
            if (resolved.consumes && resolved.consumes.length > 0) {
                //Set the first value as Content-Type
                headerObj['Content-Type'] = resolved.consumes[0];
            }
            mock.headers = headerObj;
        }
        //form-data
        if (parameters.formData && parameters.formData.length > 0) {
            formObj = parameters.formData.reduce(function (aggr, formParam) {
                aggr[formParam.name] = formParam.value;
                return aggr;
            }, formObj);
            mock.formData = Querystring.stringify(formObj);
        }
        mock.pathname = pathname;
        //Add `path` property combining `pathname` and `query`
        mock.path = (mock.query) ? mock.pathname + '?' + mock.query : mock.pathname;
    }
    return mock;
};

/**
 * Merge the common parameters at the path level to the operation parameters.
 * Common parameters are a list of parameters that are applicable for all the operations
 * described under a particular path. These parameters can be overridden at the operation level,
 * but cannot be removed there.
 */
const mergeParams = (commonParams, opsParams) => {
    let paramMap = new Map();
    if (commonParams) {
        for (let param of commonParams) {
            //A unique parameter is defined by a combination of a name and location
            paramMap.set(param.name + param.in, param);
        }
    }
    if (opsParams) {
        for (let param of opsParams) {
            //A unique parameter is defined by a combination of a name and location
            paramMap.set(param.name + param.in, param);
        }
    }
    return Array.from(paramMap.values());
};

module.exports = mockSwaggerSchema;
