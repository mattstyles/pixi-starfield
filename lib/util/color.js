'use strict';

exports.__esModule = true;
exports.colourToValue = colourToValue;

var _mathutil = require('mathutil');

/**
 * @function colourToValue
 * @param mag <Array:Float || Float> 0...1 magnitude for each colour component
 * @param from <Array:Integer> rgb colour as integers 0...255
 * @param to <Array:Integer> rgb colour as integers 0...255
 * @returns <Integer> colour value
 * Interpolates between the from and to colours using the magnitude as an interpolator.
 * @TODO error checking, testing, perf testing
 */

function colourToValue() {
    var mag = arguments.length <= 0 || arguments[0] === undefined ? [.5, .5, .5] : arguments[0];
    var from = arguments.length <= 1 || arguments[1] === undefined ? [0, 0, 0] : arguments[1];
    var to = arguments.length <= 2 || arguments[2] === undefined ? [255, 255, 255] : arguments[2];

    // Map magnitude to an array if its given as a float
    if (typeof mag === 'number') {
        mag = [mag, mag, mag];
    }

    // Return the colour value from the given params
    return [_mathutil.lerp(mag[0], from[0], to[0]) << 16, _mathutil.lerp(mag[1], from[1], to[1]) << 8, _mathutil.lerp(mag[2], from[2], to[2])].reduce(function (prev, curr) {
        return prev | curr;
    }, 0);
}