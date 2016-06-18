'use strict';
var Moment = require('moment');
var Chance = require('chance').Chance();

module.exports = {
    date: dateMock,
    'date-time': dataTimeMock,
    url: urlMock,
    email: emailMock,
    phone: phoneMock,
    uuid: guidMock,
    guid: guidMock
};

function dateMock() {
    return Moment().format('YYYY-MM-DD');
}

function dataTimeMock() {
    return Moment().toISOString();
}

function urlMock() {
    return Chance.url();
}

function emailMock() {
    return Chance.email();
}

function phoneMock() {
    return Chance.phone();
}

function guidMock() {
    return Chance.guid();
}
