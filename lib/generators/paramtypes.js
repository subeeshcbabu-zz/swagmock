'use strict';
var Generators = require('./index');

module.exports = {
    query: queryMock,
    path: queryMock,
    formData: queryMock,
    header: queryMock,
    body: bodyMock
};

var collectionFormat = {
    csv : function (val) {
        return val.join(',');
    },
    ssv: function (val) {
        return val.join(' ');
    },
    tsv: function (val) {
        return val.join('\t');
    },
    pipes: function (val) {
        return val.join('|');
    },
    multi: function (val) {
        return val;
    }
};
/**
 * TODO : Handle type `file`
 */
function queryMock(param) {
    var mock = {};
    var value = Generators.mock(param);
    var separator = collectionFormat.csv;
    //`collectionFormat` Determines the format of the array if type array is used.
    // Possible values are: csv, ssv, tsv. pipes and multi
    if (param.type === 'array' && param.collectionFormat) {
        separator = collectionFormat[param.collectionFormat] || collectionFormat.csv;
        value = separator(value, param.name);
        mock.separator = param.collectionFormat;
    }
    mock.name = param.name;
    mock.value = value;
    return mock;
}

function bodyMock(param) {
    return {
        name: param.name,
        value: Generators.mock(param.schema)
    };
}
