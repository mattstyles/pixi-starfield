'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _pixiJs = require('pixi.js');

var _pixiJs2 = _interopRequireDefault(_pixiJs);

var _bezierEasing = require('bezier-easing');

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

var _star = require('./star');

var _star2 = _interopRequireDefault(_star);

/**
 * Starfield
 * @class
 * ---
 * Generates a starfield and manages those stars
 */

var Starfield = (function () {
    function Starfield() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Starfield);

        this.opts = Object.assign({
            size: {
                width: 500,
                height: 500
            },
            density: 500
        }, opts);

        this.opts.schema = Object.assign({
            tex: null,
            scale: {
                min: .5,
                max: 1
            },
            alpha: {
                min: .1,
                max: 1
            },
            color: {
                from: [0xc0, 0xc0, 0xc8],
                to: [0xf0, 0xf2, 0xff]
            },
            tempCurve: new _bezierEasing2['default'](.75, .1, .9, .5),
            blendMode: _pixiJs2['default'].BLEND_MODES.NORMAL
        }, opts.schema || {});

        this.container = new _pixiJs2['default'].Container();
        this.pos = new _pixiJs2['default'].Point(0, 0);
        this.lastPos = new _pixiJs2['default'].Point(0, 0);
        this.setPosition(0, 0);

        // Bounds are double the active area, where pos dictates central location
        this.bounds = this._getBounds();

        this.stars = [];

        // Generate initial stars
        for (var i = 0; i < this.opts.density; i++) {
            this.container.addChild(this.createStar().sprite);
        }
    }

    /**
     * Returns the new bounding box
     * The bounding box is currently hardcoded to twice the starfield
     * minus 1 each dimension so that contains() works better
     * @returns <Pixi.Rectangle>
     */

    Starfield.prototype._getBounds = function _getBounds() {
        return new _pixiJs2['default'].Rectangle(this.pos.x - this.opts.size.width + 1, this.pos.y - this.opts.size.height + 1, -2 + this.opts.size.width * 2, -2 + this.opts.size.height * 2);
    };

    /**
     * Sets the position, updates the bounds and caches the old position
     * @param x <Integer>
     * @param y <Integer>
     */

    Starfield.prototype.setPosition = function setPosition(x, y) {
        this.lastPos.copy(this.pos);
        this.pos.set(x, y);
        this.container.position.set(-this.pos.x + this.opts.size.width / 2, -this.pos.y + this.opts.size.height / 2);
        this.bounds = this._getBounds();
    };

    /**
     * Determines the height/width of the renderable area
     * @param width <Integer>
     * @param height <Integer>
     */

    Starfield.prototype.setSize = function setSize(width, height) {
        this.opts.size.width = width;
        this.opts.size.height = height;
        this.bounds = this._getBounds();
    };

    /**
     * Creates a brand new star
     * @returns <Star>
     */

    Starfield.prototype.createStar = function createStar() {
        var star = new _star2['default'](this.opts.schema);
        star.setRandomPosition(this.bounds);

        this.stars.push(star);

        return star;
    };

    /**
     * Update should manage stars leaving the bounds and using those leavers as
     * those stars joining to maintain density whilst world coords move
     */

    Starfield.prototype.update = function update() {
        var _this = this;

        this.stars.forEach(function (star) {
            var _bounds;

            var starpos = star.getPosition();
            if (!(_bounds = _this.bounds).contains.apply(_bounds, _toConsumableArray(starpos))) {
                var diffX = _this.pos.x - starpos[0];
                var diffY = _this.pos.y - starpos[1];

                // Set position if the difference is outside the bounds
                star.setPosition(Math.abs(diffX) >= _this.opts.size.width ? _this.pos.x + diffX : starpos[0], Math.abs(diffY) >= _this.opts.size.height ? _this.pos.y + diffY : starpos[1]);
            }
        });
    };

    return Starfield;
})();

exports['default'] = Starfield;
module.exports = exports['default'];