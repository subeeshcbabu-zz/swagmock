'use strict';

module.exports = {
    OPERATIONS: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']
};


module.exports.isInteger = function(value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

module.exports.isFinite = function(value) {
    return typeof value === "number" && isFinite(value);
};
