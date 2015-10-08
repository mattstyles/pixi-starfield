'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _pixiJs = require('pixi.js');

var _pixiJs2 = _interopRequireDefault(_pixiJs);

var _bezierEasing = require('bezier-easing');

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

var _lodashRandom = require('lodash.random');

var _lodashRandom2 = _interopRequireDefault(_lodashRandom);

var _mathutil = require('mathutil');

var _starmap = require('./starmap');

var _starmap2 = _interopRequireDefault(_starmap);

var _utilColor = require('./util/color');

/**
 * Individual star class
 * @class
 * ---
 * Wraps Pixi.Sprite with a few star specific helpers
 */

var Star = (function () {
    function Star(schema) {
        _classCallCheck(this, Star);

        if (!schema) {
            throw new Error('Star class requires instantiation with a particle schema');
        }

        this.schema = schema;

        this.sprite = new _pixiJs2['default'].Sprite(this.schema.tex);
        this.sprite.anchor.set(.5, .5);
        this.sprite.blendMode = this.schema.blendMode;

        this.position = this.sprite.position;

        return this;
    }

    /**
     * Returns the sprite position as an array, useful for spreading
     * @returns <Array:Number>
     */

    Star.prototype.getPosition = function getPosition() {
        return [this.sprite.position.x, this.sprite.position.y];
    };

    /**
     * Sets the position if an update is required
     * A positional move really means this becomes a new star as the star position
     * is tied to heightmap data. To move a star on screen the starfield moves.
     * This means that as the position changes the star should calculate its brightness
     * again.
     * @param x <Number> x coord on heightmap
     * @param y <Number> y coord on heightmap
     * @returns this
     */

    Star.prototype.setPosition = function setPosition(x, y) {
        if (x === this.sprite.position.x && y === this.sprite.position.y) {
            return;
        }

        this.sprite.position.set(x, y);
        this.setBrightness();

        return this;
    };

    /**
     * Sets a random position within the bounding rectangle
     * @param bounds <Pixi.Rectangle> x, y, width, height
     * @returns this
     */

    Star.prototype.setRandomPosition = function setRandomPosition(bounds) {
        var x = _lodashRandom2['default'](bounds.x, bounds.x + bounds.width);
        var y = _lodashRandom2['default'](bounds.y, bounds.y + bounds.height);

        this.setPosition(x, y);

        return this;
    };

    /**
     * Uses the underlying heightmap data corresponding to star position to set
     * various rendering properties of the star
     * @returns this
     */

    Star.prototype.setBrightness = function setBrightness() {
        var base = _starmap2['default'].getValue(this.sprite.position.x, this.sprite.position.y);
        var temp = this.schema.tempCurve.get(base);

        this.sprite.alpha = _mathutil.lerp(temp, this.schema.alpha.min, this.schema.alpha.max);

        // Just randomise size between max and min
        var scale = _lodashRandom2['default'](this.schema.scale.min, this.schema.scale.max);
        this.sprite.scale.set(scale, scale);

        this.sprite.tint = _utilColor.colourToValue(temp, this.schema.color.from, this.schema.color.to);

        return this;
    };

    return Star;
})();

exports['default'] = Star;
module.exports = exports['default'];