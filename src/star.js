
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
        this.sprite.anchor.set( .5, .5 )
        this.sprite.blendMode = this.schema.blendMode

        this.position = this.sprite.position

        return this
    }

    getPosition() {
        return [ this.sprite.position.x, this.sprite.position.y ]
    }

    setPosition( x, y ) {
        if ( x === this.sprite.position.x && y === this.sprite.position.y ) {
            return
        }

        this.sprite.position.set( x, y )
        this.setBrightness()

        return this
    }

    setRandomPosition( bounds ) {
        let x = random( bounds.x, bounds.x + bounds.width )
        let y = random( bounds.y, bounds.y + bounds.height )

        this.setPosition( x, y )

        return this
    }

    setBrightness() {
        let base = starmap.getValue( this.sprite.position.x, this.sprite.position.y )
        let temp = this.schema.tempCurve.get( base )

        this.sprite.alpha = lerp( temp, this.schema.alpha.min, this.schema.alpha.max )

        // Just randomise size between max and min
        let scale = random( this.schema.scale.min, this.schema.scale.max )
        this.sprite.scale.set( scale, scale )

        this.sprite.tint = colourToValue( temp, this.schema.color.from, this.schema.color.to )

        return this
    }
}
