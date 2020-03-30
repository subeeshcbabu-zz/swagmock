const Assert = require('assert');
const Swagmock = require('../lib');
const Path = require('path')

describe('OpenAPI Request Mock generator', () => {
    let apiPath = Path.resolve(__dirname, 'fixture/petstore-openapi.json');
    let swagmock = Swagmock(apiPath);
    it('should generate request mock for path /store/order/{orderId}', (done) => {
        swagmock.requests({
            path: '/store/order/{orderId}',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.pathname, 'Generated pathname request');
            Assert.ok(request.path, 'Generated path request');
            done();
        });
    });

    it('should generate request mock for path /pet/findByStatus', (done) => {
        swagmock.requests({
            path: '/pet/findByStatus',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.query, 'Generated query request');
            done();
        });
    });

    it('should generate request mock for path /pet/{petId}', (done) => {
        swagmock.requests({
            path: '/pet/{petId}',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated parameters');
            Assert.ok(request.pathname, 'Generated path parameter');
            done();
        });
    });

    it('should generate request mock for path /pet/{petId}/uploadImage', (done) => {
        swagmock.requests({
            path: '/pet/{petId}/uploadImage',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.pathname, 'Generated path request');
            Assert.ok(request.requestBody, 'Generated formData request');
            done();
        });
    });

    it('should generate request mock for path /store/inventory', (done) => {
        swagmock.requests({
            path: '/store/inventory',
            operation: 'get'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            done();
        });
    });

    it('should generate request mock for path /store/order', (done) => {
        swagmock.requests({
            path: '/store/order',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.requestBody, 'Generated body request');
            let order = request.requestBody;
            Assert.ok(typeof order === 'object', 'OK value for body');
            Assert.ok(Number.isInteger(order.id), 'order.id is integer');
            Assert.ok(Number.isInteger(order.petId), 'order.petId is integer');
            Assert.ok(Number.isInteger(order.quantity), 'order.quantity is integer');
            Assert.ok(typeof order.shipDate === 'string', 'order.shipDate is string');
            Assert.ok(['placed', 'approved', 'delivered'].indexOf(order.status) !== -1, 'order.status is enum');
            Assert.ok(typeof order.complete === 'boolean', 'order.complete is boolean');
            done();
        });
    });

    it('should generate request mock for path /user/createWithArray', (done) => {
        swagmock.requests({
            path: '/user/createWithArray',
            operation: 'post'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.requestBody, 'Generated body request');
            let users = request.requestBody;
            Assert.ok(users.length === 1, 'Created a request array of users');
            let user = users[0];
            Assert.ok(typeof user === 'object', 'OK value for user request');
            Assert.ok(Number.isInteger(user.id), 'user.id is integer');
            Assert.ok(Number.isInteger(user.userStatus), 'user.userStatus is integer');
            Assert.ok(typeof user.username === 'string', 'user.username is string');

            done();
        });
    });
});
