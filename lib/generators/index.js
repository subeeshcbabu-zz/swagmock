'use strict';
var Chance = require('chance').Chance();
var Format = require('./format');

var Generators = module.exports = {
    object: objectMock,
    array: arrayMock,
    string: stringMock,
    integer: integerMock,
    number: numberMock,
    boolean: booleanMock,
    file: fileMock,
    mock: mock
};

function mock(schema) {
    var mock;
    if (schema) {
        var type = schema.type;
        var example = schema.examples || schema.example;
        /**
         * Use examples as Mock if provided
         */
        if (example) {
            mock = example;
        } else if (type) {
            /**
             * Get the mock generator from the `type` of the schema
             */
            var generator = Generators[type];
            if (generator) {
                mock = generator.call(null, schema);
            }
        }
    }
    return mock;
}

function objectMock(schema) {
    var mockObj = {};
    var props = schema.properties;
    if (props) {
        Object.keys(props).forEach(function (key) {
            mockObj[key] = mock(props[key]);
        });
    /**
     * In the absense of `properties`, check if `additionalProperties` is defined or not.
     * (If additionalProperties is an object, that object is a schema that will be used to validate
     * any additional properties not listed in properties.)
     *
     * If present, use this to generate mocks.
     */
    } else if (schema.additionalProperties) {
        //Create a random property
        mockObj[Chance.word()] = mock(schema.additionalProperties);
    }
    return mockObj;
}
/**
 * Generates a mock `array` data of `items`
 * Supports: `minItems` and `maxItems`
 * TODO: Implement `uniqueItems`
 */
function arrayMock(schema) {
    var items = schema.items;
    var min = 0;
    var max = 1;
    var arr = [];

    if (items) {
        if (schema.minItems) {
            min = schema.minItems;
        }
        if (schema.maxItems) {
            max = schema.maxItems;
        }
        for (; min <= max; min++) {
            arr.push(mock(items));
        }
    }
    return arr;
}
/**
 * Generates a mock `integer` value
 * Supports `minimum`, `maximum`, `exclusiveMinimum` and `exclusiveMaximum`
 * TODO - Validate `minimum` and `maximum` values
 */
function integerMock(schema) {
    var opts = {};
    if (schema.minimum) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum : schema.minimum + 1;
    }
    if (schema.maximum) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum : schema.maximum - 1;
    }

    return Chance.integer(opts);
}

/**
 * Generates a mock `number` value
 * Supports `minimum`, `maximum`, `exclusiveMinimum` and `exclusiveMaximum`
 * TODO - Validate `minimum` and `maximum` values
 */
function numberMock(schema) {
    var opts = {};
    if (schema.minimum) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum : schema.minimum + 0.1;
    }
    if (schema.maximum) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum : schema.maximum - 0.1;
    }
    return Chance.floating(opts);
}

function booleanMock() {
    return Chance.bool();
}
/**
 * Geneartes a mock `string`  value
 * Supports: `minLength`, `maxLength`, `enum`, `date`, and `date-time`
 * TODO : `pattern`
 */
function stringMock(schema) {
    var mockStr;
    var opts = {};
    var minLength = schema.minLength || 1;
    var maxLength = schema.maxLength || minLength + 10;
    opts.min = minLength;
    opts.max = maxLength;

    if (schema.enum && schema.enum.length > 0) {
        /**
         * If `enum` is defined for the property
         */
        mockStr = enumMock(schema);
    } else if(Format[schema.format]) {
        /**
         * If a `format` is defined for the property
         */
        mockStr = Format[schema.format].call(null, schema);
    } else {
        mockStr = Chance.string({
            length: Chance.integer(opts)
        });
    }

    return mockStr;
}

function enumMock(schema) {
    var len = schema.enum.length;
    var opts = {
        min: 0,
        max: len - 1
    };
    return schema.enum[Chance.integer(opts)];
}

function fileMock() {
    return Chance.file();
}
