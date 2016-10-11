var Assert = require('assert');
var Swagmock = require('../lib');
var Path = require('path')
//isInteger pollyfil for pre es6
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

describe('Parameters Mock generator', function () {
    var apiPath = Path.resolve(__dirname, 'fixture/petstore.json');
    var swagmock = Swagmock(apiPath);
    it('should generate parameter mock for path /store/order/{orderId} for all operations', function(done) {
        swagmock.parameters({
            path: '/store/order/{orderId}'
        }, function(err, mock) {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock.get, 'Generated mock for get operation');
            Assert.ok(mock.delete, 'Generated mock for delete operation');
            var params = mock.get.parameters;
            Assert.ok(params, 'Generated parameters');
            Assert.ok(params.path, 'Generated path parameter');
            Assert.ok(params.path[0].name === 'orderId', 'generated mock parameter for orderId');
            Assert.ok(params.path[0].value >= 1 && params.path[0].value <= 10, 'OK value for orderId');
            done();
        });
    });

    it('should generate parameter mock for all the path', function(done) {
        swagmock.parameters({}, function(err, mock) {
            var testMock;
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock['/pet'], 'Generated mock for path /pet');
            Assert.ok(mock['/pet/findByStatus'], 'Generated mock for path /pet/findByStatus');
            Assert.ok(mock['/pet/findByTags'], 'Generated mock for path /pet/findByTags');
            //Test minItems
            testMock = mock['/pet/findByTags'].get.parameters.query[0].value;
            Assert.ok(testMock.length >= 2, 'tags parameter should have minimum 2 items');
            Assert.ok(mock['/pet/{petId}'], 'Generated mock for path /pet/{petId}');
            Assert.ok(mock['/pet/{petId}/uploadImage'], 'Generated mock for path /pet/{petId}/uploadImage');
            Assert.ok(mock['/store/inventory'], 'Generated mock for path /store/inventory');
            Assert.ok(mock['/store/order'], 'Generated mock for path /store/order');
            Assert.ok(mock['/store/order/{orderId}'], 'Generated mock for path /store/order/{orderId}');
            Assert.ok(mock['/user'], 'Generated mock for path /user');
            Assert.ok(mock['/user/createWithArray'], 'Generated mock for path /user/createWithArray');
            //Test the default min and max
            testMock = mock['/user/createWithArray'].post.parameters.body[0].value;
            Assert.ok(testMock.length === 1, 'body parameter should have i item (default)');
            Assert.ok(mock['/user/createWithList'], 'Generated mock for path /user/createWithList');
            //Test maxItems
            testMock = mock['/user/createWithList'].post.parameters.body[0].value;
            Assert.ok(testMock.length <= 4, 'body parameter should have maximum 4 items');
            done();
        });
    });
});
