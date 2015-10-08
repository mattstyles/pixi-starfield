/**
 * Generates functions to procedurally generate stars
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _heightmap = require('heightmap');

var _heightmap2 = _interopRequireDefault(_heightmap);

var _fastSimplexNoise = require('fast-simplex-noise');

var _fastSimplexNoise2 = _interopRequireDefault(_fastSimplexNoise);

/**
 * @function simplex
 * @param opts <Object> simplex control variables
 * Creates simplex generator function
 */
function simplex(opts) {
    var fastSimplex = new _fastSimplexNoise2['default'](Object.assign({
        min: 0,
        max: 1,
        octaves: 4,
        frequency: .01,
        persistence: .5,
        amplitude: 1
    }, opts));

    return function (x, y) {
        return fastSimplex.get2DNoise(x, y);
    };
}

/**
 * @constant FREQ
 * Controls the frequency of the simplex wave i.e. higher numbers result
 * in larger areas of proximity (translates into larger areas of light and
 * dark stars in the starfield)
 */
var FREQ = 9;

/**
 * @function stars( x, y )
 * @param x <Integer>
 * @param y <Integer>
 * @returns <Double> clamped 0...1
 * Returns heightmap values that will ultimately determine the brightness of
 * stars within the starfield
 */
var stars = new _heightmap2['default']().generator({
    weight: 1,
    fn: simplex({
        min: .25,
        max: 1,
        octaves: 4,
        persistence: 1 / Math.pow(2, 4),
        frequency: 1 / Math.pow(2, FREQ)
    })
});

exports['default'] = stars;
module.exports = exports['default'];