var Assert = require('assert');
var Swagmock = require('../lib');
var Path = require('path')
//isInteger pollyfil for pre es6
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

describe('Response Mock generator', function () {
    var apiPath = Path.resolve(__dirname, 'fixture/petstore.json');
    it('should generate response mock for path /store/order/{orderId}', function(done) {
        Swagmock(apiPath,{
            path: '/store/order/{orderId}',
            mockResponse: true,
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            Assert.ok(Number.isInteger(resp.id), 'id is integer');
            Assert.ok(Number.isInteger(resp.petId), 'petId is integer');
            Assert.ok(Number.isInteger(resp.quantity), 'quantity is integer');
            Assert.ok(typeof resp.shipDate === 'string', 'shipDate is string');
            Assert.ok(['placed','approved','delivered'].indexOf(resp.status) !== -1, 'status is enum');
            Assert.ok(typeof resp.complete === 'boolean', 'complete is boolean');
            done();
        });
    });

    it('should generate response mock for path /pet/findByStatus', function(done) {
        Swagmock(apiPath,{
            path: '/pet/findByStatus',
            mockResponse: true,
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            Assert.ok(Array.isArray(resp), 'response is Pet array');
            var pet = resp[0];
            Assert.ok(pet, 'Ok Pet response');
            Assert.ok(Number.isInteger(pet.id), 'id is integer');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet/{petId}', function(done) {
        Swagmock(apiPath,{
            path: '/pet/{petId}',
            mockResponse: true,
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet/{petId}/uploadImage', function(done) {
        Swagmock(apiPath,{
            path: '/pet/{petId}/uploadImage',
            mockResponse: true,
            operation: 'post',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/inventory', function(done) {
        Swagmock(apiPath,{
            path: '/store/inventory',
            mockResponse: true,
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/order', function(done) {
        Swagmock(apiPath,{
            path: '/store/order',
            mockResponse: true,
            operation: 'post',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /user/login', function(done) {
        Swagmock(apiPath,{
            path: '/user/login',
            mockResponse: true,
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet', function(done) {
        Swagmock(apiPath,{
            path: '/pet',
            mockResponse: true,
            operation: 'post',
            response: '405'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.response;
            Assert.ok(!resp, 'No response');
            //TODO add asserts for pending props
            done();
        });
    });
})
