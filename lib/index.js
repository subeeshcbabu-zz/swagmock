'use strict';
var Parser = require('swagger-parser');
var Generators = require('./generators');
var ParamTypes = require('./generators/paramtypes');

module.exports = function mockGen(apiPath, options, callback) {
    options = options || {};

    Parser.validate(apiPath, function (error, api) {
        if (error) {
            callback(error);
            return;
        }
        callback(null, mockSchema(api, options));
    });
};

function mockSchema(api, options) {
    var mock = {};
    var paths = api.paths;
    if (paths) {
        var pathObj = paths[options.path];
        if (pathObj) {
            //Found the requested path
            var opsObj = pathObj[options.operation];
            if (opsObj) {
                //Found the operation
                //Mock response
                if (options.mockResponse) {
                    mock.response = mockResponse(opsObj, options);
                }
                //Mock Parameters
                if (options.mockParams) {
                    mock.parameters = mockParameters(opsObj, options);
                }
            }
        }
    }
    return mock;
}
/**
 * Generate a mock response object
 *
 */
function mockResponse(opsObj, options) {
    var mockResp;
    var response = opsObj.responses[options.response];
    if (response) {
        //Found the response
        var schema = response.schema;
        if (schema) {
            mockResp = Generators.mock(schema);
        }
    }
    return mockResp;
}
/**
 * Generate a mock parameter list
 *
 */
function mockParameters(opsObj, options) {
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
