'use strict';
const Chance = require('chance').Chance();
const Format = require('./format');
const Randexp = require('randexp').randexp;

const mock = schema => {
    let mock;
    if (schema) {
        let type = schema.type || findType(schema);
        /**
         * Get the mock generator from the `type` of the schema
         */
        const generator = Generators[type];
        if (generator) {
            mock = generator.call(null, schema);
        }
    }
    return mock;
};

const objectMock = ({ properties, additionalProperties }) => {
    let mockObj = {};
    if (properties) {
        Object.keys(properties).forEach(function (key) {
            mockObj[key] = mock(properties[key]);
        });
    /**
     * In the absense of `properties`, check if `additionalProperties` is defined or not.
     * (If additionalProperties is an object, that object is a schema that will be used to validate
     * any additional properties not listed in properties.)
     *
     * If present, use this to generate mocks.
     */
    } else if (additionalProperties) {
        //Create a random property
        mockObj[Chance.word()] = mock(additionalProperties);
    }
    return mockObj;
};
/**
 * Generates a mock `array` data of `items`
 * Supports: `minItems` and `maxItems`
 * TODO: Implement `uniqueItems`
 */
const arrayMock = ({ items, minItems, maxItems }) => {
    let min;
    let max;
    let numItems;
    let arr = [];

    if (items) {
        //Use the min as the base
        min = minItems || 1;
        if (maxItems) {
            //If min is greater than max, use min as max.
            max = (maxItems < min) ? min : maxItems;
        } else {
            //If max is not defined, use min as max.
            max = min;
        }
        //Find the number of items with min and max boundary parameters.
        numItems = Chance.integer({
            min: min,
            max: max
        });
        for (let i = 0; i < numItems; i++) {
            arr.push(mock(items));
        }
    }
    return arr;
};
/**
 * Generates a mock `integer` value
 * Supports `minimum`, `maximum`, `exclusiveMinimum` and `exclusiveMaximum`
 * TODO - Validate `minimum` and `maximum` values
 */
const integerMock = schema => {
    let opts = {};
    let intmock;

    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }

    if (Number.isInteger(schema.minimum)) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum + 1 : schema.minimum;
    }
    if (Number.isInteger(schema.maximum)) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum - 1 : schema.maximum;
    }
    //Generate a number that is multiple of schema.multipleOf
    if (Number.isInteger(schema.multipleOf) && schema.multipleOf > 0) {
        //Use the min/muplilier as the min number
        //Use default min as 1 if min is not properly set.
        opts.min = (Number.isInteger(opts.min) && opts.min > 0) ? (Math.ceil(opts.min / schema.multipleOf)) : 1;
        //Use the max/muplilier as the new max value
        //Use a default - min + 10 - if max value is not properly set.
        opts.max = (Number.isInteger(opts.max)) ? (Math.floor(opts.max / schema.multipleOf)) : (opts.min + 10);
        intmock = Chance.integer(opts);
        intmock = intmock * schema.multipleOf;
    } else {
        intmock = Chance.integer(opts);
    }
    return intmock;
};

/**
 * Generates a mock `number` value
 * Supports `minimum`, `maximum`, `exclusiveMinimum` and `exclusiveMaximum`
 * TODO - Validate `minimum` and `maximum` values
 */
const numberMock = schema => {
    let opts = {};
    let nummock;

    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }

    if (schema.minimum) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum : schema.minimum + 0.1;
    }
    if (schema.maximum) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum : schema.maximum - 0.1;
    }
    //Generate a number that is multiple of schema.multipleOf
    if (schema.multipleOf > 0) {
        //Use the muplilier as the min number
        opts.min = schema.multipleOf;
        //Use the max/muplilier as the new max value
        opts.max = (opts.max) ? opts.max / schema.multipleOf : opts.max;
        nummock = Chance.floating(opts);
        nummock = nummock * schema.multipleOf;
    } else {
        nummock = Chance.floating(opts);
    }
    return nummock;
};

const booleanMock = schema => {
    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }
    return Chance.bool();
};
/**
 * Geneartes a mock `string`  value
 * Supports: `minLength`, `maxLength`, `enum`, `date`, and `date-time`
 *
 */
const stringMock = schema => {
    let mockStr;
    let opts = {};
    let minLength = schema.minLength || 1;
    let maxLength = schema.maxLength || minLength + 10;
    opts.min = minLength;
    opts.max = maxLength;

    if (schema.enum && schema.enum.length > 0) {
        /**
         * If `enum` is defined for the property
         */
        mockStr = enumMock(schema);
    } else if (schema.pattern) {
        /**
         * If `pattern` is defined for the property
         */
        mockStr = Randexp(schema.pattern);
    } else if(Format[schema.format]) {
        /**
         * If a `format` is defined for the property
         */
        mockStr = Format[schema.format].call(null, schema);
    } else {
        mockStr = Chance.string({
            length: Chance.integer(opts),
            alpha: true //Use only alpha characters
        });
    }

    return mockStr;
};

const enumMock = schema => {
    let len = schema.enum.length;
    let opts = {
        min: 0,
        max: len - 1
    };
    return schema.enum[Chance.integer(opts)];
};

const fileMock = () => {
    return Chance.file();
};

//Find out the type based on schema props
//(This is not a complete list or full proof solution)
const findType = schema => {
    let type = 'object';// Use 'object' as the default type
    if (schema.pattern) {
        type = 'string';
    } else if (schema.items) {
        type = 'array';
    }
    return type;
};

const Generators = module.exports = {
    object: objectMock,
    array: arrayMock,
    string: stringMock,
    integer: integerMock,
    number: numberMock,
    boolean: booleanMock,
    file: fileMock,
    mock
};
