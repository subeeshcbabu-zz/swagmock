const Parser = require('swagger-parser');
const Maybe = require('call-me-maybe');

const mockSwaggerSchema = require('./util/swagger-mocks');
const mockOpenAPISchema = require('./util/openapi-mocks');

module.exports = (api, options) => {
    return new SwagMock(api, options);
};

function SwagMock(api, {validated} = {}) {
    //If the api is an already validated Object, use it as it is.
    //If not validated, Parse and validate using 'swagger-parser'
    this.swagger = validated ? Promise.resolve(api) : Parser.validate(api);
}

SwagMock.prototype.responses = function (options = {}, callback) {
    options.mockResponses = true;
    return Maybe(callback, this.mock(options));
};

SwagMock.prototype.parameters = function (options = {}, callback) {
    options.mockParams = true;
    return Maybe(callback, this.mock(options));
};

SwagMock.prototype.requests = function (options = {}, callback) {
    options.mockRequest = true;
    return Maybe(callback, this.mock(options));
};

SwagMock.prototype.mock = function (options = {}) {

    return this.swagger.then(api => {
        return api.openapi ? mockOpenAPISchema(api, options) : mockSwaggerSchema(api, options);
    });
};
