
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'

import starmap from './starmap'
import Star from './star'
import Schema from './schema'

/**
 * Starfield
 * @class
 * ---
 * Generates a starfield and manages those stars
 */
export default class Starfield {
    /**
     * @constructs
     * @param opts <Object> options, also should contain schema for star creation
     */
    constructor( opts = {} ) {
        this.opts = Object.assign({
            /**
             * Size of rendering area
             * @type <Object>
             *   @prop width <Integer> _def 500_ pixel width of rendering area
             *   @prop height <Integer> _def 500_ pixel height of rendering area
             */
            size: {
                width: 500,
                height: 500
            },

            /**
             * Star density i.e. number of stars in current bounding area
             * @type <Integer> _def 500_
             */
            density: 500,

            /**
             * Pixi filters to apply to the container, applying at the star level
             * is, like, well too slow man
             * @type <Array|Pixi.filters> _def null_
             */
            filters: null,

            /**
             * Forces a container to be used. Under some circumstances a particle
             * container will be used as a free speed boost, however, if colour
             * tinting is later added then it wont do anything, so turn this on
             * to force rendering into a regular container if you need tinting
             * at any point in the lifecycle.
             * Similarly, if the density changes use a regular container.
             * @type <Boolean> _def false_
             */
            forceContainer: false
        }, opts )

        this.schema = new Schema( opts.schema || {} )

        // If colour values are required then use a regular ole container,
        // otherwise hit the turbo boost. Note that there is currently no mechanism
        // to change container type if a color is supplied later.
        this.container = opts.forceContainer || ( opts.schema && opts.schema.color )
            ? new Pixi.Container()
            : this._createParticleContainer( this.opts.density, this.schema )

        if ( this.opts.filters ) {
            this.opts.filters = Array.isArray( this.opts.filters )
                ? this.opts.filters
                : [ this.opts.filters ]

            this.container.filters = this.opts.filters
        }

        // Position gets set during the setPosition, make sure initially it differs
        // so that setPosition does its thang and repositions the container to make
        // sure that the position variable refers to the center of the container.
        this.pos = new Pixi.Point( -1, 0 )
        this.lastPos = new Pixi.Point( 0, 0 )
        this.setPosition( 0, 0 )

        // Bounds are double the active area, where pos dictates central location
        this.bounds = this._getBounds()

        this.stars = []

        // Generate initial stars
        for ( let i = 0; i < this.opts.density; i++ ) {
            this.container.addChild( this.createStar().sprite )
        }
    }

    /**
     * Creates a particle container
     * Particle container are quicker but dont support sprite tinting, however,
     * not every starfield requires tinting! Speedy speedy
     * In reality the difference isnt so great, the update loop logic takes most
     * of the time, not the rendering, but, if you really need a boost, you can.
     * Note also that there is currently no mechanism to change container type,
     * so adding colour later won’t work.
     * @param density <Integer> number of stars
     * @param schema <Schema> star generation schema
     * @returns <Pixi.ParticleContainer>
     */
    _createParticleContainer( density, schema ) {
        return new Pixi.ParticleContainer( density, {
            scale: true,
            alpha: true,
            position: true,
            rotation: schema.get( 'rotation' ),
            uvs: false
        })
    }

    /**
     * Returns the new bounding box
     * The bounding box is currently hardcoded to twice the starfield
     * minus 1 each dimension so that contains() works better
     * @returns <Pixi.Rectangle>
     */
    _getBounds() {
        return new Pixi.Rectangle(
            this.pos.x - this.opts.size.width,
            this.pos.y - this.opts.size.height,
            this.opts.size.width * 2,
            this.opts.size.height * 2
        )
    }

    /**
     * Sets the position, updates the bounds and caches the old position
     * @param x <Integer>
     * @param y <Integer>
     * @returns this
     */
    setPosition( x, y ) {
        // Noop if new position is the same as the current position
        if ( this.pos.x === x && this.pos.y === y ) {
            return
        }

        this.lastPos.copy( this.pos )
        this.pos.set( x, y )

        this.container.position.set( -this.pos.x + this.opts.size.width / 2, -this.pos.y + this.opts.size.height / 2 )
        this.bounds = this._getBounds()

        return this
    }

    /**
     * Determines the height/width of the renderable area
     * @param width <Integer>
     * @param height <Integer>
     * @returns this
     */
    setSize( width, height ) {
        this.opts.size.width = width
        this.opts.size.height = height
        this.bounds = this._getBounds()

        return this
    }

    /**
     * Creates a brand new star
     * @returns <Star>
     */
    createStar() {
        let star = new Star( this.schema )
        star.setRandomPosition( this.bounds )

        this.stars.push( star )

        return star
    }

    /**
     * Translates a position in a certain dimension when that position is out
     * of bounds. Currently only 'x' and 'y' are supported for dimension.
     * @param dim <String> 'x' or 'y' only or bad things will happen
     * @param position <Float> the position to translate
     */
    _translateDimension( dim, position ) {
        // Quick check equality i.e. this dimension has not moved
        if ( this.lastPos[ dim ] === this.pos[ dim ] ) {
            return position
        }

        // Set magnitude to move star by, if this dimension is still contained
        // within bounds then set to 0
        let mag = dim === 'x' ? this.bounds.width : this.bounds.height

        if ( dim === 'x' ) {
            if ( position >= this.bounds.x && position < this.bounds.x + this.bounds.width ) {
                mag = 0
            }
        }

        if ( dim === 'y' ) {
            if ( position >= this.bounds.y && position < this.bounds.y + this.bounds.height ) {
                mag = 0
            }
        }


        // Translate forward or backward by bounding width based on direction moved
        return this.lastPos[ dim ] > this.pos[ dim ]
            ? position -= mag
            : position += mag
    }

    /**
     * Update should manage stars leaving the bounds and using those leavers as
     * those stars joining to maintain density whilst world coords move
     */
    update() {

        this.stars.forEach( star => {
            let starpos = star.getPosition()
            if ( !this.bounds.contains( ...starpos ) ) {
                // Set position if the difference is outside the bounds
                star.setPosition(
                    this._translateDimension( 'x', starpos[ 0 ] ),
                    this._translateDimension( 'y', starpos[ 1 ] )
                )
            }
        })
    }
}
