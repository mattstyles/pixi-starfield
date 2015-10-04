
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'
import random from 'lodash.random'
import { lerp } from 'mathutil'

import stars from './stars'
import star from './star'
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
            initialSize: {
                width: 500,
                height: 500
            },
            density: 500,
            tex: null
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
        this.container.width = this.opts.initialSize.width
        this.container.height = this.opts.initialSize.height
        this.pos = this.container.position
        this.pos.set( this.opts.initialPosition.x, this.opts.initialPosition.y )

        let halfW = this.container.width / 2
        let halfH = this.container.height / 2

        this.bounds = new Pixi.Rectangle(
            this.pos.x - halfW,
            this.pos.y - halfH,
            this.pos.x + halfW,
            this.pos.y + halfH
        )

        this.stars = []

        // Generate initial stars
        for ( let i = 0; i < this.opts.density; i++ ) {
            this.container.addChild( this.createStar() )
        }
    }

    /**
     * Creates a brand new star
     */
    createStar() {
        let star = new Star( this.opts.tex )
        this.stars.push( star )

        // New stars need a position, whack em in the starfield bounds

    }

    // @TODO refactor to star class
    createRandomStarPosition( star, rect ) {
        let x = random( rect.x - rect.width, rect.x + rect.width )
        let y = random( rect.y - rect.height, rect.y + rect.height )
        star.position.set( x, y )
        return star
    }

    // @TODO refactor to star class or star factory class
    getStarDistance( star ) {
        let base = stars.getValue( star.position.x, star.position.y )
        let temp = this.opts.tempCurve.get( base )

        // Clamp alpha using temp
        star.alpha = lerp( temp, this.opts.alpha.min, this.opts.alpha.max )

        // Linear randomise star size
        let scale = lerp( random( 0, 1 ), this.opts.scale.min, this.opt.scale.max )
        star.scale.set( scale, scale )

        // Tint from temp
        star.tint = colourToValue( temp, this.opts.color.from, this.opts.color.to )

        return star
    }
}
