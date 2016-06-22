var Assert = require('assert');
var Swagmock = require('../lib');
var Path = require('path')
//isInteger pollyfil for pre es6
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

describe('Request Mock generator', function () {
    var apiPath = Path.resolve(__dirname, 'fixture/petstore.json');
    var swagmock = Swagmock(apiPath);
    it('should generate request mock for path /store/order/{orderId}', function(done) {
        swagmock.requests({
            path: '/store/order/{orderId}',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.pathname, 'Generated pathname request');
            done();
        });
    });

    it('should generate request mock for path /pet/findByStatus', function(done) {
        swagmock.requests({
            path: '/pet/findByStatus',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.query, 'Generated query request');
            done();
        });
    });

    it('should generate request mock for path /pet/{petId}', function(done) {
        swagmock.requests({
            path: '/pet/{petId}',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated parameters');
            Assert.ok(request.pathname, 'Generated path parameter');
            done();
        });
    });

    it('should generate request mock for path /pet/{petId}/uploadImage', function(done) {
        swagmock.requests({
            path: '/pet/{petId}/uploadImage',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.pathname, 'Generated path request');
            Assert.ok(request.formData, 'Generated formData request');
            done();
        });
    });

    it('should generate request mock for path /store/inventory', function(done) {
        swagmock.requests({
            path: '/store/inventory',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            done();
        });
    });

    it('should generate request mock for path /store/order', function(done) {
        swagmock.requests({
            path: '/store/order',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.body, 'Generated body request');
            var order = request.body;
            Assert.ok(typeof order === 'object', 'OK value for body');
            Assert.ok(Number.isInteger(order.id), 'order.id is integer');
            Assert.ok(Number.isInteger(order.petId), 'order.petId is integer');
            Assert.ok(Number.isInteger(order.quantity), 'order.quantity is integer');
            Assert.ok(typeof order.shipDate === 'string', 'order.shipDate is string');
            Assert.ok(['placed','approved','delivered'].indexOf(order.status) !== -1, 'order.status is enum');
            Assert.ok(typeof order.complete === 'boolean', 'order.complete is boolean');
            done();
        });
    });

    it('should generate request mock for path /user/createWithArray', function(done) {
        swagmock.requests({
            path: '/user/createWithArray',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var request = mock.request;
            Assert.ok(request, 'Generated request');
            Assert.ok(request.body, 'Generated body request');
            var users = request.body;
            Assert.ok(users.length === 2, 'Created a request array of users');
            var user = users[0];
            Assert.ok(typeof user === 'object', 'OK value for user request');
            Assert.ok(Number.isInteger(user.id), 'user.id is integer');
            Assert.ok(Number.isInteger(user.userStatus), 'user.userStatus is integer');
            Assert.ok(typeof user.username === 'string', 'user.username is string');

            done();
        });
    });
});
