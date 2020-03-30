const Generators = require('./index');

// https://github.com/OAI/OpenAPI-Specification/blob/3.0.1/versions/3.0.1.md#style-values
const collectionFormat = {
    matrix: val => val.join(';'),
    label: val => val.join('.'),
    form: val => val.join('&'),
    simple: val => val.join(','),
    spaceDelimited: val => val.join(' '),
    pipeDelimited: val => val.join('|'),
    deepObject: val => val
};
/**
 * TODO : Handle type `file`
 */
const queryMock = param => {
    let mock = {};
    let value = Generators.mock(param.schema);
    const style = param.style || getDefaultStyle(param);
    let separator = collectionFormat[style];
    //`collectionFormat` Determines the format of the array if type array is used.
    // Possible values are: csv, ssv, tsv. pipes and multi
    if (param.schema.type === 'array') {
        value = separator(value, param.name);
    }
    mock.name = param.name;
    mock.value = value;
    return mock;
};

const getDefaultStyle = (param) => {
    let style;
    switch (param.in) {
        case 'query':
        case 'cookie':
            style = 'form';
            break;
        default:
            style = 'simple';
            break;
    }
    return style;
};

const bodyMock = schema => {
    return Generators.mock(schema);
};

module.exports = {
    query: queryMock,
    path: queryMock,
    cookie: queryMock,
    header: queryMock,
    requestBody: bodyMock
};
