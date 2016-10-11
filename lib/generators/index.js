'use strict';
var Chance = require('chance').Chance();
var Format = require('./format');
var Util = require('../util');
var Randexp = require('randexp').randexp;

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
        var type = schema.type || findType(schema);
        /**
         * Get the mock generator from the `type` of the schema
         */
        var generator = Generators[type];
        if (generator) {
            mock = generator.call(null, schema);
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
    var min;
    var max;
    var numItems;
    var arr = [];

    if (items) {
        //Use the min as the base
        min = schema.minItems || 1;
        if (schema.maxItems) {
            //If min is greater than max, use min as max.
            max = (schema.maxItems < min) ? min : schema.maxItems;
        } else {
            //If max is not defined, use min as max.
            max = min;
        }
        //Find the number of items with min and max boundary parameters.
        numItems = Chance.integer({
            min: min,
            max: max
        });
        for (var i = 0; i < numItems; i++) {
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
    var intmock;

    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }

    if (Util.isInteger(schema.minimum)) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum + 1 : schema.minimum;
    }
    if (Util.isInteger(schema.maximum)) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum - 1 : schema.maximum;
    }
    //Generate a number that is multiple of schema.multipleOf
    if (Util.isInteger(schema.multipleOf) && schema.multipleOf > 0) {
        //Use the muplilier as the min number
        //Use default min as 1 if min is not properly set.
        opts.min = (Number.isInteger(opts.min)) ? (Math.ceil(opts.min / schema.multipleOf)) : 1;
        //Use the max/muplilier as the new max value.
        //Use a default - min + 10 - if max value is not properly set.
        opts.max = (Number.isInteger(opts.max)) ? (Math.floor(opts.max / schema.multipleOf)) : (opts.min + 10);
        intmock = Chance.integer(opts);
        intmock = intmock * schema.multipleOf;
    } else {
        intmock = Chance.integer(opts);
    }
    return intmock;
}

/**
 * Generates a mock `number` value
 * Supports `minimum`, `maximum`, `exclusiveMinimum` and `exclusiveMaximum`
 * TODO - Validate `minimum` and `maximum` values
 */
function numberMock(schema) {
    var opts = {};
    var nummock;

    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }

    if (Util.isFinite(schema.minimum)) {
        opts.min = (schema.exclusiveMinimum) ? schema.minimum + 0.1 : schema.minimum;
    }
    if (Util.isFinite(schema.maximum)) {
        opts.max = (schema.exclusiveMaximum) ? schema.maximum - 0.1 : schema.maximum;
    }
    //Generate a number that is multiple of schema.multipleOf
    if (Util.isFinite(schema.multipleOf) && schema.multipleOf > 0) {
        //Use the min/muplilier as the min number
        //Use default min as 1 if min is not properly set
        opts.min = (Number.isFinite(opts.min)) ? (Math.ceil(opts.min / schema.multipleOf)) : 1;
        //Use the max/muplilier as the new max value
        //Use a default - min + 10 - if max value is not properly set.
        opts.max = (Number.isFinite(opts.max)) ? (Math.floor(opts.max / schema.multipleOf)) : (opts.min + 10);

        nummock = Chance.integer(opts);
        nummock = nummock * schema.multipleOf;
    } else {
        nummock = Chance.floating(opts);
    }
    return nummock;
}

function booleanMock(schema) {
    /**
     * If `enum` is defined for the property
     */
    if (schema.enum && schema.enum.length > 0) {
        return enumMock(schema);
    }
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

//Find out the type based on schema props
//(This is not a complete list or full proof solution)
function findType(schema) {
    var type = 'object';// Use 'object' as the default type
    if (schema.pattern) {
        type = 'string';
    } else if (schema.items) {
        type = 'array';
    }
    return type;
}
