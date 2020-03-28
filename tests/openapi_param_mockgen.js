const Assert = require('assert');
const Swagmock = require('../lib');
const Path = require('path');
const Parser = require('swagger-parser');

describe('OpenAPI Parameter Mock generator', () => {
    let apiPath = Path.resolve(__dirname, 'fixture/petstore-openapi.json');
    let apiResolver = Parser.validate(apiPath);
    //Test case of valiadted api use case.
    let swagmock = Swagmock(apiResolver, {validated: true});
    it('should generate parameter mock for path /store/order/{orderId}', done => {
        swagmock.parameters({
            path: '/store/order/{orderId}',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'orderId', 'generated mock parameter for orderId');
            Assert.ok(params.path[0].value >= 1 && params.path[0].value <= 10, 'OK value for orderId');
            done();
        });
    });

    it('should generate parameter mock for path /pet/findByStatus', done => {
        swagmock.parameters({
            path: '/pet/findByStatus',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.query, 'Generated query parameter');
            Assert.ok(params.query[0].name === 'status', 'generated mock request body for status');
            Assert.ok(params.query[0].value, 'OK value for status');
            Assert.ok(params.query[0].value.indexOf('&') > -1, 'OK form separator');
            done();
        });
    });

    it('should generate parameter mock for path /pet/{petId}', done => {
        swagmock.parameters({
            path: '/pet/{petId}',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'petId', 'generated mock parameter for petId');
            Assert.ok(Number.isInteger(params.path[0].value), 'OK value for petId');
            //Test the operation level overrides
            Assert.ok(params.path[0].value >= 1000 && params.path[0].value <= 2000, 'OK value for petId');

            Assert.ok(params.query, 'Generated query parameter');
            params.query.forEach(param => {
                if (param.name === 'petName') {
                    Assert.ok(/awesome+ (pet|cat|bird)/.test(param.value), 'OK value for petName');
                }
                if (param.name === 'petWeight') {
                    Assert.ok(Number.isFinite(param.value), 'OK value for petWeight');
                    Assert.ok(param.value <= 500 && param.value >= 10, 'OK value for petWeight');
                }
                if (param.name === 'bmi') {
                    Assert.ok(Number.isFinite(param.value), 'OK value for bmi');
                    Assert.ok(param.value <= 1 && param.value >= 0, 'OK value for bmi');
                }
            });

            done();
        });
    });

    it('should generate parameter mock for path /pet/{petId} post - common parameter', (done) => {
        swagmock.parameters({
            path: '/pet/{petId}',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'petId', 'generated mock parameter for petId');
            Assert.ok(Number.isInteger(params.path[0].value), 'OK value for petId');

            done();
        });
    });

    it('should generate parameter mock for path /pet/{petId}/uploadImage', (done) => {
        swagmock.parameters({
            path: '/pet/{petId}/uploadImage',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            const body = mock.requestBody;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'petId', 'generated mock parameter for petId');
            Assert.ok(Number.isInteger(params.path[0].value), 'OK value for petId');
            Assert.ok(params.path[0].value > 1000 && params.path[0].value < 1010, 'OK value for petId');
            Assert.ok(body, 'Generated request body ');
            Assert.ok(typeof body['additionalMetadata'] !== 'undefined', 'generated mock parameter for additionalMetadata');
            Assert.ok(typeof body['additionalMetadata'] === 'string', 'OK value for additionalMetadata');
            done();
        });
    });

    it('should generate parameter mock for path /store/inventory', (done) => {
        swagmock.parameters({
            path: '/store/inventory',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            done();
        });
    });

    it('should generate request body mock for path /store/order', (done) => {
        swagmock.parameters({
            path: '/store/order',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const body = mock.requestBody;
            Assert.ok(body, 'Generated request body');
            Assert.ok(Number.isInteger(body.id), 'order.id is integer');
            Assert.ok(Number.isInteger(body.petId), 'order.petId is integer');
            Assert.ok(Number.isInteger(body.quantity), 'order.quantity is integer');
            Assert.ok(typeof body.shipDate === 'string', 'order.shipDate is string');
            Assert.ok(['placed', 'approved', 'delivered'].indexOf(body.status) !== -1, 'order.status is enum');
            Assert.ok(typeof body.complete === 'boolean', 'order.complete is boolean');
            done();
        });
    });

    it('should generate request body mock for path /user/createWithArray', (done) => {
        swagmock.parameters({
            path: '/user/createWithArray',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const body = mock.requestBody;
            Assert.ok(body, 'Generated request body');

            Assert.ok(body.length === 1, 'Created a parameter array of users');
            const user = body[0];
            Assert.ok(typeof user === 'object', 'OK value for user parameter');
            Assert.ok(Number.isInteger(user.id), 'user.id is integer');
            Assert.ok(Number.isInteger(user.userStatus), 'user.userStatus is integer');
            Assert.ok(user.userStatus > 1000, 'user.userStatus is greater than 1000');
            Assert.ok(user.userStatus % 100 === 0, 'user.userStatus is multipleOf 100');
            Assert.ok(typeof user.username === 'string', 'user.username is string');
            done();
        });
    });

    it('should generate parameter mock for path /user/logout', (done) => {
        swagmock.parameters({
            path: '/user/logout',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            const params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.query, 'Generated path parameter');
            Assert.ok(params.query[0].name === 'common', 'generated mock parameter for common parameter');
            done();
        });
    });
});
