'use strict';
var Moment = require('moment');
var Chance = require('chance').Chance();
var Randexp = require('randexp').randexp;

module.exports = {
    date: dateMock,
    'date-time': dataTimeMock,
    uri: urlMock,
    url: urlMock,
    email: emailMock,
    phone: phoneMock,
    uuid: guidMock,
    guid: guidMock,
    ipv4: ipv4,
    ipv6: ipv6,
    hostname: hostname
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

function ipv4() {
    return Chance.ip();
}

function ipv6() {
    return Chance.ipv6();
}

function hostname() {
    return Randexp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm);
}
