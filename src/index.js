
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'

import Star from './star'


/**
 * Starfield
 * @class
 * ---
 * Generates a starfield and manages those stars
 */
export default class Starfield {
    constructor( opts = {} ) {
        this.opts = Object.assign({
            size: {
                width: 500,
                height: 500
            },
            density: 500,
            filters: null
        }, opts )

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
            rotation: false,
            tempCurve: new Bezier( .75, .1, .9, .5 ),
            blendMode: Pixi.BLEND_MODES.NORMAL
        }, opts.schema || {} )

        // If colour values are required then use a regular ole container,
        // otherwise hit the turbo boost
        this.container = opts.schema && opts.schema.color
            ? new Pixi.Container()
            : this._createParticleContainer( this.opts.density )

        if ( this.opts.filters ) {
            this.opts.filters = Array.isArray( this.opts.filters )
                ? this.opts.filters
                : [ this.opts.filters ]

            this.container.filters = this.opts.filters
        }

        this.pos = new Pixi.Point( 0, 0 )
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
     * @TODO remove reliance on `this`, make pure
     */
    _createParticleContainer( density ) {
        return new Pixi.ParticleContainer( density, {
            scale: true,
            alpha: true,
            position: true,
            rotation: this.opts.schema.rotation,
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
            this.pos.x - this.opts.size.width + 1,
            this.pos.y - this.opts.size.height + 1,
            -2 + this.opts.size.width * 2,
            -2 + this.opts.size.height * 2
        )
    }

    /**
     * Sets the position, updates the bounds and caches the old position
     * @param x <Integer>
     * @param y <Integer>
     */
    setPosition( x, y ) {
        this.lastPos.copy( this.pos )
        this.pos.set( x, y )
        this.container.position.set( -this.pos.x + this.opts.size.width / 2, -this.pos.y + this.opts.size.height / 2 )
        this.bounds = this._getBounds()
    }

    /**
     * Determines the height/width of the renderable area
     * @param width <Integer>
     * @param height <Integer>
     */
    setSize( width, height ) {
        this.opts.size.width = width
        this.opts.size.height = height
        this.bounds = this._getBounds()
    }

    /**
     * Creates a brand new star
     * @returns <Star>
     */
    createStar() {
        let star = new Star( this.opts.schema )
        star.setRandomPosition( this.bounds )

        this.stars.push( star )

        return star
    }

    /**
     * Update should manage stars leaving the bounds and using those leavers as
     * those stars joining to maintain density whilst world coords move
     */
    update() {
        this.stars.forEach( star => {
            let starpos = star.getPosition()
            if ( !this.bounds.contains( ...starpos ) ) {
                let diffX = this.pos.x - starpos[ 0 ]
                let diffY = this.pos.y - starpos[ 1 ]

                // Set position if the difference is outside the bounds
                star.setPosition(
                    Math.abs( diffX ) >= this.opts.size.width ? this.pos.x + diffX : starpos[ 0 ],
                    Math.abs( diffY ) >= this.opts.size.height ? this.pos.y + diffY : starpos[ 1 ]
                )
            }
        })
    }
}
