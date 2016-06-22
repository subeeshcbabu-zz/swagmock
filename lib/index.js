'use strict';
var Parser = require('swagger-parser');
var Generators = require('./generators');
var ParamTypes = require('./generators/paramtypes');
var Util = require('./util');
var Querystring = require('querystring');

module.exports = function (apiPath) {
    return new SwagMock(apiPath);
};

function SwagMock(apiPath) {
    this.swagger = Parser.validate(apiPath);
}

SwagMock.prototype.responses = function(options, callback) {
    options = options || {};
    options.mockResponses = true;
    this.mock(options, callback);
};

SwagMock.prototype.parameters = function(options, callback) {
    options = options || {};
    options.mockParams = true;
    this.mock(options, callback);
};

SwagMock.prototype.requests = function(options, callback) {
    options = options || {};
    options.mockRequest = true;
    this.mock(options, callback);
};

SwagMock.prototype.mock = function(options, callback) {
    options = options || {};
    this.swagger.then(function(api) {
        callback(null, mockSchema(api, options));
    }).catch(function(error) {
        callback(error);
    });
};

function mockSchema(api, options) {
    var mock = {};
    var paths = api.paths;
    if (paths) {
        var pathObj = paths[options.path];
        if (pathObj) {
            //Found the requested path
            mockPath(options.path, pathObj, mock, options);
        } else {
            //Generate Mocks for all the paths
            Object.keys(paths).forEach(function(pathStr) {
                var pathObj = paths[pathStr];
                if (pathObj) {
                    var pathMock = {};
                    mockPath(pathStr, pathObj, pathMock, options);
                    mock[pathStr] = pathMock;
                }
            });
        }
    }
    return mock;
}
/**
 *
 */
function mockPath(pathStr, pathObj, mock, options) {
    var opsObj = pathObj[options.operation];
    //Common parameters - A list of parameters that are applicable for
    //all the operations described under this path
    //var commParams = pathObj.parameters;
    if (opsObj) {
        //Found the operation
        mockOperation({
            path: pathStr,
            operation: options.operation
        }, opsObj, mock, options);
    } else {
        Object.keys(pathObj).forEach(function(operation) {
            if (pathObj[operation] && Util.OPERATIONS.indexOf(operation) !== -1) {
                //Valid operation.
                var opsMock = {};
                mockOperation({
                    path: pathStr,
                    operation: operation
                }, pathObj[operation], opsMock, options);
                mock[operation] = opsMock;
            }
        });
    }
}
/**
 *
 */
function mockOperation(resolved, opsObj, mock, options) {
    //Mock response
    if (options.mockResponses) {
        mock.responses = mockResponses(opsObj, options);
    }
    //Mock Parameters
    if (options.mockParams) {
        mock.parameters = mockParameters(opsObj, options);
    }
    //Mock Requests
    if (options.mockRequest) {
        mock.request = mockRequest(resolved, mock.parameters || mockParameters(opsObj, options));
    }
}
/**
 * Generate a mock responses
 *
 */
function mockResponses(opsObj, options) {
    var mockResp;
    var responses = opsObj.responses;
    if (responses) {
        var response = responses[options.response];
        if (response) {
            //Found the response
            mockResp = mockResponse(response);
        } else {
            mockResp = mockResp || {};
            Object.keys(responses).forEach(function(responseStr) {
                var response = responses[responseStr];
                if (response) {
                    mockResp[responseStr] = mockResponse(response);
                }
            });
        }
    }
    return mockResp;
}
/**
 *
 */
function mockResponse(response) {
    var mockResp;
    var schema = response.schema;
    if (schema) {
        mockResp = Generators.mock(schema);
    }
    return mockResp;
}
/**
 * Generate a mock parameter list
 *
 */
function mockParameters(opsObj) {
    var mockParam = {};
    var parameters = opsObj.parameters;
    if (parameters && parameters.length > 0) {
        //Iterate over each parameter
        parameters.forEach(function(param) {
            // `in` - The location of the parameter.
            // Possible values are "query", "header", "path", "formData" or "body".
            var paramType = param.in;
            if (ParamTypes[paramType]) {
                //Found the Mock generator for the param type (AKA `location`, AKA `in`).
                mockParam[paramType] = mockParam[paramType] || [];
                mockParam[paramType].push(ParamTypes[paramType].call(null, param));
            }
        });
    }
    return mockParam;
}
/**
 * Generates the mock request objects that can be used for tests
 */
function mockRequest(resolved, parameters) {
    var mock = {};
    var queryObj = {};
    var headerObj = {};
    var formObj = {};
    var pathname = resolved.path;

    if (parameters) {
        //path
        if (parameters.path && parameters.path.length > 0) {
            parameters.path.forEach(function (pathParam) {
                if (pathParam && pathParam.name) {
                    pathname = pathname.replace(new RegExp('{' + pathParam.name + '}', 'g'), pathParam.value);
                }
            });
            mock.pathname = pathname;
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
    }
    return mock;
}
