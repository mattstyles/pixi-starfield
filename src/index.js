
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'
import random from 'lodash.random'
import { lerp } from 'mathutil'

import stars from './stars'
import { colourToValue } from './util/color'

/**
 * Starfield
 * @class
 * ---
 * Generates a starfield and manages those stars
 */
export default class Starfield {
    constructor( opts ) {
        this.opts = Object.assign({
            initialPosition: {
                x: 0,
                y: 0
            },
            size: {
                width: 500,
                height: 500
            },
            density: 500,
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
                from: [ 0xc0, 0xc0, 0xc8 ],
                to: [ 0xf0, 0xf2, 0xff ]
            },
            tempCurve: new Bezier( .75, .1, .9, .5 )
        }, opts )

        this.container = new Pixi.Container()
        this.container.pivot.set( this.opts.size.width / 2, this.opts.size.height / 2 )
        this.pos = this.container.position
        this.pos.set( this.opts.initialPosition.x || this.opts.size.width / 2, this.opts.initialPosition.y || this.opts.size.height / 2 )
        this.lastPos = new Pixi.Point( 0, 0 )

        // Bounds are double the active area, where pos dictates central location
        this.bounds = this._getBounds()

        this.stars = []

        // Generate initial stars
        for ( let i = 0; i < this.opts.density; i++ ) {
            this.container.addChild( this.createStar() )
        }
    }

    /**
     * Returns the new bounding box
     * The bounding box is currently hardcoded to twice the starfield
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
     */
    setPosition( x, y ) {
        this.lastPos.copy( this.pos )
        this.pos.set( x, y )
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
     */
    createStar() {
        let star = new Pixi.Sprite( this.opts.tex )
        this.stars.push( star )

        // New stars need a position, whack em in the starfield bounds
        star = this.createRandomStarPosition( star, this.bounds )

        star = this.getStarDistance( star )

        return star
    }

    // @TODO refactor to star class
    createRandomStarPosition( star, rect ) {
        let x = random( rect.x, rect.x + rect.width )
        let y = random( rect.y, rect.y + rect.height )
        star.position.set( x, y )
        return star
    }

    // @TODO refactor to star class or star factory class
    getStarDistance( star ) {
        let base = stars.getValue( star.position.x, star.position.y )
        // This alters the curve from light to dark in the simplex noise, left
        // as is and slightly too linear
        let temp = this.opts.tempCurve.get( base )

        // Clamp alpha using temp
        star.alpha = lerp( temp, this.opts.alpha.min, this.opts.alpha.max )

        // Linear randomise star size
        let scale = lerp( random( 0, 1 ), this.opts.scale.min, this.opts.scale.max )
        star.scale.set( scale, scale )

        // Tint from temp
        star.tint = colourToValue( temp, this.opts.color.from, this.opts.color.to )

        return star
    }

    /**
     * Update should manage stars leaving the bounds and using those leavers as
     * those stars joining to maintain density whilst world coords move
     */
    update() {
        this.stars.forEach( star => {
            if ( !this.bounds.contains( star.position.x, star.position.y ) ) {
                console.log( star )
                star = this.createRandomStarPosition( star, this.bounds )
            }
        })
    }
}
