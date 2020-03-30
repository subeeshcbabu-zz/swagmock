'use strict';

const Generators = require('../generators/index');
const ParamTypes = require('../generators/openpai-param-types');
const Querystring = require('querystring');
const OPERATIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

const mockOpenAPISchema = (api, options) => {
    const mock = {};
    const paths = api.paths;
    if (paths) {
        const pathObj = paths[options.path];
        if (pathObj) {
            //Found the requested path
            mockPath(options.path, pathObj, mock, options);
        } else {
            //Generate Mocks for all the paths
            Object.keys(paths).forEach(function (pathStr) {
                const pathValue = paths[pathStr];
                if (pathValue) {
                    let pathMock = {};
                    mockPath(pathStr, pathValue, pathMock, options);
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
    const opsObj = pathObj[options.operation];
    //Common parameters - A list of parameters that are applicable for
    //all the operations described under this path
    const commParams = pathObj.parameters;
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
                const opsMock = {};
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
        mock.parameters = mockParameters(resolved, opsObj);
        mock.requestBody = mockRequestBody(opsObj);
    }
    //Mock Requests
    if (options.mockRequest) {
        mock.request = mockRequest(resolved, mock.parameters || mockParameters(resolved, opsObj), mock.requestBody || mockRequestBody(opsObj));
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
    const responses = opsObj.responses;
    if (responses) {
        let response = responses[options.response];
        if (response) {
            //Found the response
            mockResp = mockResponse(response, options.useExamples);
        } else {
            mockResp = {};
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
 * @param response      The value of the response code
 * @param useExamples   boolean Whether to use examples presents in schema
 * @return Object       mock response
 */
const mockResponse = (response, useExamples) => {
    let mockResp;
    if (response) {
        // Use the first available content ype
        const schema = getContentSchema(response);
        if (schema) {
            mockResp = Generators.mock(schema, useExamples);
        }
    }
    return mockResp;
};

/**
 * Returns the schema available in the content
 * @param response      The value of the response code
 * @return schema
 */
const getContentSchema = (response) => {
    let schema;
    if (response && response.content) {
        const contentTypes = Object.keys(response.content);
        if (contentTypes.length) {
            // Use the first available content ype
            schema = response.content[contentTypes[0]].schema;
            const examples = response.content[contentTypes[0]].examples;
            if (examples) {
                // Array with example value
                schema['examples'] = Object.values(examples).map(example => example.value);
            }
        }
    }
    return schema;
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
            // Possible values are "query", "header", "path" or "cookie".
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

const mockRequestBody = (response) => {
    let mockBody = {};
    if (response.requestBody) {
        const schema = getContentSchema(response.requestBody);
        mockBody = ParamTypes.requestBody(schema);

    }
    return mockBody;
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
 * @param requestBody
 * @return {{}}
 */
const mockRequest = (resolved, parameters, requestBody) => {
    let mock = {};
    let queryObj = {};
    let headerObj = {};
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
        // requestBody
        if (requestBody) {
            mock.requestBody = requestBody;
        }
        mock.pathname = pathname;
        // Add `path` property combining `pathname` and `query`
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

module.exports = mockOpenAPISchema;
