const Assert = require('assert');
const Swagmock = require('../../lib');
const Path = require('path')
const Parser = require('swagger-parser');

describe('Responses Mock generator', () => {
    let apiPath = Path.resolve(__dirname, '../fixture/petstore.json');
    let apiResolver = Parser.validate(apiPath);
    let swagmock = Swagmock(apiResolver, { validated: true });

    it('should generate response mock for path /store/order/{orderId}, get operation', (done) => {
        let mockgen = swagmock.responses({
            path: '/store/order/{orderId}',
            operation: 'get'
        });
        mockgen.then(mock => {
            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            Assert.ok(resp.hasOwnProperty('200'), 'Generated 200 response');
            Assert.ok(resp.hasOwnProperty('400'), 'Generated 400 response');
            Assert.ok(resp.hasOwnProperty('404'), 'Generated 404 response');
            let successResp = resp['200'];
            Assert.ok(Number.isInteger(successResp.id), 'id is integer');
            Assert.ok(Number.isInteger(successResp.petId), 'petId is integer');
            Assert.ok(Number.isInteger(successResp.quantity), 'quantity is integer');
            Assert.ok(typeof successResp.shipDate === 'string', 'shipDate is string');
            Assert.ok(['placed','approved','delivered'].indexOf(successResp.status) !== -1, 'status is enum');
            Assert.ok(typeof successResp.complete === 'boolean', 'complete is boolean');
            done();
        }).catch(err => {
            if (err) throw err;
            done();
        });
    });

    it('should generate response mock for path /pet/findByStatus, for all operations', (done) => {
        let mockgen = swagmock.responses({
            path: '/pet/findByStatus'
        });
        mockgen.then(mock => {
            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock.get, 'Generated mock for `get` operation');
            let responses = mock.get.responses;
            Assert.ok(responses, 'Generated responses');
            Assert.ok(responses.hasOwnProperty('200'), 'Generated 200 response');
            Assert.ok(responses.hasOwnProperty('400'), 'Generated 400 response');
            let resp = responses['200'];
            Assert.ok(Array.isArray(resp), 'response is Pet array');
            let pet = resp[0];
            Assert.ok(pet, 'Ok Pet response');
            Assert.ok(Number.isInteger(pet.id), 'id is integer');
            done();
        }).catch(err => {
            if (err) throw err;
            done();
        });
    });

    it('should generate response mock for path /pet/{petId} for all operations', (done) => {
        swagmock.responses({
            path: '/pet/{petId}'
        }, (err, mock) => {
            if (err) throw err;

            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock.get, 'Generated mock for get operation');
            Assert.ok(mock.post, 'Generated mock for post operation');
            Assert.ok(mock.delete, 'Generated mock for delete operation');
            let responses = mock.delete.responses;
            Assert.ok(responses, 'Generated response for delete operation');
            Assert.ok(responses.hasOwnProperty('404'), 'Generated 404 response');
            Assert.ok(responses.hasOwnProperty('400'), 'Generated 400 response');
            done();
        });
    });

    it('should generate response mock for all paths', (done) => {
        swagmock.responses({}, (err, mock) => {
            let testMock;
            if (err) throw err;
            Assert.ok(mock, 'Generated mock');
            Assert.ok(mock['/pet'], 'Generated mock for path /pet');
            Assert.ok(mock['/pet/findByStatus'], 'Generated mock for path /pet/findByStatus');
            Assert.ok(mock['/pet/findByTags'], 'Generated mock for path /pet/findByTags');
            Assert.ok(mock['/pet/{petId}'], 'Generated mock for path /pet/{petId}');
            //test the minItems and MaxItems
            testMock = mock['/pet/{petId}'].get.responses['200'].tags;
            Assert.ok(testMock.length <= 5 && testMock.length >= 2, 'tags response should have min 2 and max 5 items');
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
