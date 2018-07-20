const Generators = require('./index');

const defaultStyle = {
    query: 'form',
    path: 'simple',
    header: 'simple',
    cookie: 'form'
};

const arrayStyles = {
    // matrix: val => ';' + val.join(','),
    // label: val => '.' + val.join('.'),
    // form: val => val.join('\t'),
    simple: val => val.join(','),
    spaceDelimited: val => val.join('%20'),
    pipeDelimited: val => val.join('|'),
    // deepObject: val => val.join('|'),
};

/**
 * TODO : Handle type `file`
 */
const queryMock = param => {
    // Describes how the parameter value will be serialized depending on the type of the parameter 
    // value. Default values (based on value of in): for query - form; for path - simple; for header
    //  - simple; for cookie - form.
    if (typeof param.style !== 'string') {
        param.style = defaultStyle[param.in];
    }

    // When this is true, parameter values of type array or object generate separate parameters for 
    // each value of the array or key-value pair of the map. For other types of parameters this property
    // has no effect. When style is form, the default value is true. For all other styles, the default 
    // value is false.
    if (typeof param.explode === 'undefined') {
        param.explode = param.style == 'form';
    }

    let value = Generators.mock(param);

    if (param.type === 'array') {
        const collector = arrayStyles[param.style] || arrayStyles.simple;

        console.log({collector})
        console.log({value})
        value = collector(value, param.explode);
        console.log({value})

    }

    // TODO Support object collection too https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#style-values
    if (param.type === 'object') {
    }

    return {
        name: param.name,
        value: value
    };
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
