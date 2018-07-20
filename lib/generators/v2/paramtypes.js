const Generators = require('./index');

const collectionFormat = {
    csv : val => val.join(','),
    ssv: val => val.join(' '),
    tsv: val => val.join('\t'),
    pipes: val => val.join('|'),
    multi: val => val
};
/**
 * TODO : Handle type `file`
 */
const queryMock = param => {
    let mock = {};
    let value = Generators.mock(param);
    let separator = collectionFormat.csv;
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
};

const bodyMock = param => {
    return {
        name: param.name,
        value: Generators.mock(param.schema)
    };
};

module.exports = {
    query: queryMock,
    path: queryMock,
    formData: queryMock,
    header: queryMock,
    body: bodyMock
};
