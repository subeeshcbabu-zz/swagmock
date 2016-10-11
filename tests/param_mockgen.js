var Assert = require('assert');
var Swagmock = require('../lib');
var Path = require('path');
var Util = require('../lib/util');
//isInteger pollyfil for pre es6
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

describe('Parameter Mock generator', function () {
    var apiPath = Path.resolve(__dirname, 'fixture/petstore.json');
    var swagmock = Swagmock(apiPath);
    it('should generate parameter mock for path /store/order/{orderId}', function(done) {
        swagmock.parameters({
            path: '/store/order/{orderId}',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'orderId', 'generated mock parameter for orderId');
            Assert.ok(params.path[0].value >= 1 && params.path[0].value <= 10, 'OK value for orderId');
            done();
        });
    });

    it('should generate parameter mock for path /pet/findByStatus', function(done) {
        swagmock.parameters({
            path: '/pet/findByStatus',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.query, 'Generated query parameter');
            Assert.ok(params.query[0].name === 'status', 'generated mock parameter for status');
            Assert.ok(params.query[0].value, 'OK value for status');
            Assert.ok(params.query[0].separator === 'multi' , 'OK multi separator');
            done();
        });
    });

    it('should generate parameter mock for path /pet/{petId}', function(done) {
        swagmock.parameters({
            path: '/pet/{petId}',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'petId', 'generated mock parameter for petId');
            Assert.ok(Number.isInteger(params.path[0].value), 'OK value for petId');
            Assert.ok(params.path[0].value >= 1000 && params.path[0].value <= 2000, 'OK value for petId');
            Assert.ok(params.query, 'Generated query parameter');
            params.query.forEach(function (param) {
                if (param.name === 'petName') {
                    Assert.ok(/awesome+ (pet|cat|bird)/.test(param.value), 'OK value for petName');
                }
                if (param.name === 'petWeight') {
                    Assert.ok(Util.isFinite(param.value), 'OK value for petWeight');
                    Assert.ok(param.value <= 500 && param.value >= 10, 'OK value for petWeight');
                }
                if (param.name === 'bmi') {
                    Assert.ok(Util.isFinite(param.value), 'OK value for bmi');
                    Assert.ok(param.value <= 1 && param.value >= 0, 'OK value for bmi');
                }
            });
            done();
        });
    });

    it('should generate parameter mock for path /pet/{petId}/uploadImage', function(done) {
        swagmock.parameters({
            path: '/pet/{petId}/uploadImage',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'petId', 'generated mock parameter for petId');
            Assert.ok(Number.isInteger(params.path[0].value), 'OK value for petId');
            Assert.ok(params.path[0].value > 1000 && params.path[0].value < 1010, 'OK value for petId');
            Assert.ok(params.formData, 'Generated formData parameter');
            Assert.ok(params.formData[0].name === 'additionalMetadata', 'generated mock parameter for additionalMetadata');
            Assert.ok(typeof params.formData[0].value === 'string', 'OK value for additionalMetadata');
            done();
        });
    });

    it('should generate parameter mock for path /store/inventory', function(done) {
        swagmock.parameters({
            path: '/store/inventory',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            done();
        });
    });

    it('should generate parameter mock for path /store/order', function(done) {
        swagmock.parameters({
            path: '/store/order',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.body, 'Generated body parameter');
            Assert.ok(params.body[0].name === 'body', 'generated mock parameter for body');
            var order = params.body[0].value;
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

    it('should generate parameter mock for path /user/createWithArray', function(done) {
        swagmock.parameters({
            path: '/user/createWithArray',
            operation: 'post'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');

            Assert.ok(params.body, 'Generated body parameter');
            Assert.ok(params.body[0].name === 'body', 'generated mock parameter for body');
            var users = params.body[0].value;
            Assert.ok(users.length === 1, 'Created a parameter array of users');
            var user = users[0];
            Assert.ok(typeof user === 'object', 'OK value for user parameter');
            Assert.ok(Number.isInteger(user.id), 'user.id is integer');
            Assert.ok(Number.isInteger(user.userStatus), 'user.userStatus is integer');
            Assert.ok(user.userStatus > 1000, 'user.userStatus is greater than 1000');
            Assert.ok(user.userStatus % 100 === 0, 'user.userStatus is multipleOf 100');
            Assert.ok(typeof user.username === 'string', 'user.username is string');

            done();
        });
    });

    it('should generate parameter mock for path /user/logout', function(done) {
        swagmock.parameters({
            path: '/user/logout',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var params = mock.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.query, 'Generated path parameter');
            Assert.ok(params.query[0].name === 'common', 'generated mock parameter for common parameter');
            done();
        });
    });
});
