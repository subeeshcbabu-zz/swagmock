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

    it('should generate response mock for path /store/order/{orderId}, get operation', function(done) {
        swagmock.responses({
            path: '/store/order/{orderId}',
            operation: 'get'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            var resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            Assert.ok(resp.hasOwnProperty('200'), 'Generated 200 response');
            Assert.ok(resp.hasOwnProperty('400'), 'Generated 400 response');
            Assert.ok(resp.hasOwnProperty('404'), 'Generated 404 response');
            var successResp = resp['200'];
            Assert.ok(Number.isInteger(successResp.id), 'id is integer');
            Assert.ok(Number.isInteger(successResp.petId), 'petId is integer');
            Assert.ok(Number.isInteger(successResp.quantity), 'quantity is integer');
            Assert.ok(typeof successResp.shipDate === 'string', 'shipDate is string');
            Assert.ok(['placed','approved','delivered'].indexOf(successResp.status) !== -1, 'status is enum');
            Assert.ok(typeof successResp.complete === 'boolean', 'complete is boolean');
            done();
        });
    });

    it('should generate response mock for path /pet/findByStatus, for all operations', function(done) {
        swagmock.responses({
            path: '/pet/findByStatus'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock.get, 'Generated mock for `get` operation');
            var responses = mock.get.responses;

            Assert.ok(responses, 'Generated responses');
            Assert.ok(responses.hasOwnProperty('200'), 'Generated 200 response');
            Assert.ok(responses.hasOwnProperty('400'), 'Generated 400 response');

            var resp = responses['200'];
            Assert.ok(Array.isArray(resp), 'response is Pet array');
            var pet = resp[0];
            Assert.ok(pet, 'Ok Pet response');
            Assert.ok(Number.isInteger(pet.id), 'id is integer');

            done();
        });
    });

    it('should generate response mock for path /pet/{petId} for all operations', function(done) {
        swagmock.responses({
            path: '/pet/{petId}'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock.get, 'Generated mock for get operation');
            Assert.ok(mock.post, 'Generated mock for post operation');
            Assert.ok(mock.delete, 'Generated mock for delete operation');
            var responses = mock.delete.responses;
            Assert.ok(responses, 'Generated response for delete operation');
            Assert.ok(responses.hasOwnProperty('404'), 'Generated 404 response');
            Assert.ok(responses.hasOwnProperty('400'), 'Generated 400 response');
            done();
        });
    });

    it('should generate response mock for all paths', function(done) {
        swagmock.responses({}, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock['/pet'], 'Generated mock for path /pet');
            Assert.ok(mock['/pet/findByStatus'], 'Generated mock for path /pet/findByStatus');
            Assert.ok(mock['/pet/findByTags'], 'Generated mock for path /pet/findByTags');
            Assert.ok(mock['/pet/{petId}'], 'Generated mock for path /pet/{petId}');
            Assert.ok(mock['/pet/{petId}/uploadImage'], 'Generated mock for path /pet/{petId}/uploadImage');
            Assert.ok(mock['/store/inventory'], 'Generated mock for path /store/inventory');
            Assert.ok(mock['/store/order'], 'Generated mock for path /store/order');
            Assert.ok(mock['/store/order/{orderId}'], 'Generated mock for path /store/order/{orderId}');
            Assert.ok(mock['/user'], 'Generated mock for path /user');
            Assert.ok(mock['/user/createWithArray'], 'Generated mock for path /user/createWithArray');
            Assert.ok(mock['/user/createWithList'], 'Generated mock for path /user/createWithList');

            done();
        });
    });
});
