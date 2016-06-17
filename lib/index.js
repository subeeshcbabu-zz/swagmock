'use strict';
var Parser = require('swagger-parser');
var Generators = require('./generators');

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
                    mock.params = mockParameters(opsObj, options);
                }
            }
        }
    }
    return mock;
}

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

function mockParameters(opsObj, options) {
    var mockParam;
    var parameter = opsObj.parameters[options.parameter];
    if (parameter) {
        //Found the parameter
        var schema = parameter.schema;
        if (schema) {
            mockParam = Generators.mock(schema);
        }
    }
    return mockParam;
}
