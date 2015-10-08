
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'
import random from 'lodash.random'
import { lerp } from 'mathutil'

import starmap from './starmap'
import { colourToValue } from './util/color'

/**
 * Individual star class
 * @class
 * ---
 * Wraps Pixi.Sprite with a few star specific helpers
 */
export default class Star {
    constructor( schema ) {
        if ( !schema ) {
            throw new Error( 'Star class requires instantiation with a particle schema' )
        }

        this.schema = schema

        this.sprite = new Pixi.Sprite( this.schema.tex )
        // this.sprite.anchor.set( .5, .5 )
        // this.sprite.blendMode = this.schema.blendMode

        this.position = this.sprite.position

        return this
    }

    /**
     * Returns the sprite position as an array, useful for spreading
     * @returns <Array:Number>
     */
    getPosition() {
        return [ this.sprite.position.x, this.sprite.position.y ]
    }

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
    setPosition( x, y ) {
        if ( x === this.sprite.position.x && y === this.sprite.position.y ) {
            return
        }

        this.sprite.position.set( x, y )
        this.setBrightness()

        return this
    }

    /**
     * Sets a random position within the bounding rectangle
     * @param bounds <Pixi.Rectangle> x, y, width, height
     * @returns this
     */
    setRandomPosition( bounds ) {
        let x = random( bounds.x, bounds.x + bounds.width )
        let y = random( bounds.y, bounds.y + bounds.height )

        this.setPosition( x, y )

        return this
    }

    /**
     * Uses the underlying heightmap data corresponding to star position to set
     * various rendering properties of the star
     * @returns this
     */
    setBrightness() {
        let base = starmap.getValue( this.sprite.position.x, this.sprite.position.y )
        let temp = this.schema.tempCurve.get( base )

        this.sprite.alpha = lerp( temp, this.schema.alpha.min, this.schema.alpha.max )

        // Just randomise size between max and min
        let scale = random( this.schema.scale.min, this.schema.scale.max )
        this.sprite.scale.set( scale, scale )

        if ( this.schema.color ) {
            this.sprite.tint = colourToValue( temp, this.schema.color.from, this.schema.color.to )
        }

        return this
    }
}
