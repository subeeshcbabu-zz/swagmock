'use strict';
const Moment = require('moment');
const Chance = require('chance').Chance();
const Randexp = require('randexp').randexp;

const date = () => {
    return Moment().format('YYYY-MM-DD');
};

const dataTimeMock = () => {
    return Moment().toISOString();
};

const url = () => {
    return Chance.url();
};

const email = () => {
    return Chance.email();
};

const phone = () => {
    return Chance.phone();
};

const guid = () => {
    return Chance.guid();
};

const ipv4 = () => {
    return Chance.ip();
};

const ipv6 = () => {
    return Chance.ipv6();
};

const hostname = () => {
    return Randexp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm);
};

module.exports = {
    date,
    'date-time': dataTimeMock,
    uri: url,
    url,
    email,
    phone,
    uuid: guid,
    guid,
    ipv4,
    ipv6,
    hostname
};
