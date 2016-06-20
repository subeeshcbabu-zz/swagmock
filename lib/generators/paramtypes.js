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
    multi: function (val, name) {
        return val.map(function (elem) {
            return name + '=' + elem;
        }).join('&');
    }
};
/**
 * TODO : Handle type `file`
 */
function queryMock(param) {
    var mock;
    var value = Generators.mock(param);
    var separator = collectionFormat.csv;
    //`collectionFormat` Determines the format of the array if type array is used.
    // Possible values are: csv, ssv, tsv. pipes and multi
    if (param.type === 'array' && param.collectionFormat) {
        separator = collectionFormat[param.collectionFormat] || collectionFormat.csv;
        value = separator(value, param.name);
    }
    mock = {
        name: param.name,
        value: value
    };
    //Add a special separator field to identify the multi separator
    if (param.collectionFormat === 'multi') {
        mock.separator = 'multi';
    }
    return mock;
}

function bodyMock(param) {
    return {
        name: param.name,
        value: Generators.mock(param.schema)
    };
}
