'use strict';
const Moment = require('moment');
const Chance = require('chance').Chance();
const Randexp = require('randexp').randexp;

const date = () => Moment().format('YYYY-MM-DD');
const dataTime = () => Moment().toISOString();
const url = () => Chance.url();
const email = () => Chance.email();
const phone = () => Chance.phone();
const guid = () => Chance.guid();
const ipv4 = () => Chance.ip();
const ipv6 = () => Chance.ipv6();
const hostname = () => Randexp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm);

module.exports = {
    date,
    'date-time': dataTime,
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
