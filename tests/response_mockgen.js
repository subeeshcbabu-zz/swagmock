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
    var swagmock = Swagmock(apiPath);

    it('should generate response mock for path /store/order/{orderId}', function(done) {
        swagmock.responses({
            path: '/store/order/{orderId}',
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
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
        swagmock.responses({
            path: '/pet/findByStatus',
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
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
        swagmock.responses({
            path: '/pet/{petId}',
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet/{petId}/uploadImage', function(done) {
        swagmock.responses({
            path: '/pet/{petId}/uploadImage',
            operation: 'post',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/inventory', function(done) {
        swagmock.responses({
            path: '/store/inventory',
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/order', function(done) {
        swagmock.responses({
            path: '/store/order',
            operation: 'post',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /user/login', function(done) {
        swagmock.responses({
            path: '/user/login',
            operation: 'get',
            response: '200'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet', function(done) {
        swagmock.responses({
            path: '/pet',
            operation: 'post',
            response: '405'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(!resp, 'No response');
            //TODO add asserts for pending props
            done();
        });
    });
});
