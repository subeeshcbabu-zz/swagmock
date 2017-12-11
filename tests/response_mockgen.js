const Assert = require('assert');
const Swagmock = require('../lib');
const Path = require('path')

describe('Response Mock generator', () => {
    let apiPath = Path.resolve(__dirname, 'fixture/petstore.json');
    let swagmock = Swagmock(apiPath);

    it('should generate response mock for path /store/order/{orderId}', (done) => {
        swagmock.responses({
            path: '/store/order/{orderId}',
            operation: 'get',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');
            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            Assert.ok(Number.isInteger(resp.id), 'id is integer');
            Assert.ok(Number.isInteger(resp.petId), 'petId is integer');
            Assert.ok([ 1, 3, 5 ].indexOf(resp.quantity) != -1, 'quantity is integer enum');
            Assert.ok(typeof resp.shipDate === 'string', 'shipDate is string');
            Assert.ok(['placed','approved','delivered'].indexOf(resp.status) !== -1, 'status is enum');
            Assert.ok(typeof resp.complete === 'boolean', 'complete is boolean');
            done();
        });
    });

    it('should generate response mock for path /pet/findByStatus', (done) => {
        swagmock.responses({
            path: '/pet/findByStatus',
            operation: 'get',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            Assert.ok(Array.isArray(resp), 'response is Pet array');
            let pet = resp[0];
            Assert.ok(pet, 'Ok Pet response');
            Assert.ok(Number.isInteger(pet.id), 'id is integer');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet/{petId}', (done) => {
        swagmock.responses({
            path: '/pet/{petId}',
            operation: 'get',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });


    it('should use the example "doggie" when generating with examples for path /pet/{petId}', (done) => {
        swagmock.responses({
            path: '/pet/{petId}',
            operation: 'get',
            response: '200',
            useExamples: true
        }, (err, mock) => {

            let resp = mock.responses;
            Assert.equal(resp.name, 'doggie');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should include properties specified in allOf for path /pet/{petId}', (done) => {
      swagmock.responses({
          path: '/pet/{petId}',
          operation: 'get',
          response: '200',
          useExamples: true
      }, (err, mock) => {
          let resp = mock.responses;
          Assert.ok(resp['test-one'], 'Generated value for test-one');
          Assert.equal(resp['test-two'], 20);
          Assert.ok(resp['name'], 'Generated value for name');
          done();
      });
    });

    it('should generate response mock for path /pet/{petId}/uploadImage', (done) => {
        swagmock.responses({
            path: '/pet/{petId}/uploadImage',
            operation: 'post',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/inventory', (done) => {
        swagmock.responses({
            path: '/store/inventory',
            operation: 'get',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /store/order', (done) => {
        swagmock.responses({
            path: '/store/order',
            operation: 'post',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /user/login', (done) => {
        swagmock.responses({
            path: '/user/login',
            operation: 'get',
            response: '200'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(resp, 'Generated response');
            //TODO add asserts for pending props
            done();
        });
    });

    it('should generate response mock for path /pet', (done) => {
        swagmock.responses({
            path: '/pet',
            operation: 'post',
            response: '405'
        }, (err, mock) => {
            Assert.ok(!err, 'No error');

            Assert.ok(mock, 'Generated mock');
            let resp = mock.responses;
            Assert.ok(!resp, 'No response');
            //TODO add asserts for pending props
            done();
        });
    });

});
