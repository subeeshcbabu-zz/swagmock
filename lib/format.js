'use strict';
var Moment = require('moment');

module.exports = {
    'date': dateMock,
    'date-time': dataTimeMock
};

function dateMock() {
    return Moment().format('YYYY-MM-DD');
}

function dataTimeMock() {
    return Moment().toISOString();
}
