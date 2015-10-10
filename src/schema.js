
import isPlainObject from 'lodash.isplainobject'
import xtend from 'xtend'
import { lerp } from 'mathutil'
import Bezier from 'bezier-easing'

import starmap from './starmap'

/**
 * Private schemas symbol
 * @type <Symbol>
 * @constant
 */
const schemas = Symbol( 'schemas' )

/**
 * Default options for a schema, different from those properties used to
 * define stars
 * @type <Object>
 * @constant
 */
const _opts = {
    maxCount: 500
}

/**
 * The default schema for star generation
 * @type <Object>
 * @constant
 */
const _schema = {
    /**
     * Holds the array of textures to use for a sprite
     * @type <Array|Pixi.Texture>
     */
    tex: null,

    /**
     * Alpha min and max for sprite transparency
     * @type <Object>
     *   @prop min <Float> _def 0_
     *   @prop max <Float> _def 1_
     */
    alpha: {
        min: 0,
        max: 1
    },

    /**
     * Sprite scale
     * @type <Object>
     *   @prop min <Float> _def .2_
     *   @prop max <Float> _def 1_
     */
    scale: {
        min: .2,
        max: 1
    },

    /**
     * If set then the star texture will be rotated based on heightmap
     * @type <Boolean> _def false_
     */
    rotation: false,

    /**
     * Further attentuates the heightmap curves for some props
     * @type <Object> uses a bezier class, but its basically used as a function
     */
    tempCurve: new Bezier( .75, .1, .9, .5 ),

    /**
     * Temp values below this wont be rendered at all
     * @type <Float> clamped 0<=x<=1
     */
    threshold: 0,

    /**
     * The underlying heightmap used to extensively during star generation
     * @type <HeightMap> _def @see starmap.js_
     */
    starmap: starmap
}

/**
 * Property interpolation functions
 * @type <Object>
 */
var interpolate = {
    /**
     * Linearly interpolates scale
     * @param scalar <Float> expected 0<=x<=1
     * @param a <Object> first scale object
     * @param b <Object> second scale object
     */
    scale: function( scalar, a, b ) {
        if ( Object.is( a, b ) ) {
            return a
        }
        return {
            min: lerp( scalar, a.min, b.min ),
            max: lerp( scalar, a.max, b.max )
        }
    },

    /**
     * Linearly interpolates alpha
     * @param scalar <Float> expected 0<=x<=1
     * @param a <Object> first alpha object
     * @param b <Object> second alpha object
     */
    alpha: function( scalar, a, b ) {
        if ( Object.is( a, b ) ) {
            return a
        }
        return {
            min: lerp( scalar, a.min, b.min ),
            max: lerp( scalar, a.max, b.max )
        }
    },

    /**
     * Linearly interpolates each separate colour component
     * @param scalar <Float> expected 0<=x<=1
     * @param a <Array> first colour array
     * @param b <Array> second colour array
     */
    color: function( scalar, a, b ) {
        if ( Object.is( a, b ) ) {
            return a
        }
        return {
            from: [
                lerp( scalar, a.from[ 0 ], b.from[ 0 ] ),
                lerp( scalar, a.from[ 1 ], b.from[ 1 ] ),
                lerp( scalar, a.from[ 2 ], b.from[ 2 ] )
            ],
            to: [
                lerp( scalar, a.to[ 0 ], b.to[ 0 ] ),
                lerp( scalar, a.to[ 1 ], b.to[ 1 ] ),
                lerp( scalar, a.to[ 2 ], b.to[ 2 ] )
            ]
        }
    }
}

/**
 * @class
 * Holds various aspects of the schema used to generate stars.
 * Many properties are dictated for each star based on an underlying heightmap,
 * but star implementation is separate from schema.
 * The main task of the schema class is actually to manage changing schemas. As
 * new schemas (or changes of schema more likely) are added the returned values
 * linearly interpolates between the previous schema and the now current schema.
 * This interpolation occurs for a set amount of time (defaults to 500 get
 * operations), note that usually when a star gets moved or created a handful of
 * get ops will occur.
 * Only when the array of schemas gets back to 1 schema does the interpolation
 * phase end and the faster regular lookups occur. Changing schemas is hard on
 * number of calculations so benchmark when changing, particularly quick changes.
 */
export default class Schema {
    /**
     * @constructs
     * @param schema <Object> props to copy over or extend over default schema
     * @param opts <Object> options for the schema, only used for schema
     *   interpolation at present
     */
    constructor( schema, opts = {} ) {
        if ( !schema || !isPlainObject( schema ) ) {
            throw new TypeError( 'Schema must be specified as a plain object' )
        }

        this.opts = xtend( _opts, opts )

        // Measures the length of the interpolation phase. The interpolation phase
        // occurs when more than one schema exists and ends when count hits 0,
        // whereby the previous schema is ejected from the list
        this.count = 0

        this[ schemas ] = [ xtend( _schema, schema ) ]
    }

    /**
     * Sets the current schema.
     * This queues the _current_ schema behind an interpolation phase that moves
     * between schemas.
     * Partial schemas can be used which will copy unspecified values from the
     * previous schema.
     * @param schema <Object> the new complete or partial schema
     * @return this
     */
    setSchema( schema ) {
        if ( !schema || !isPlainObject( schema ) ) {
            throw new TypeError( 'Schema must be specified as a plain object' )
        }

        // Add a new schema onto the stack
        this[ schemas ].push( xtend( this[ schemas ][ this[ schemas ].length - 1 ], schema ) )
        this.count = this.opts.maxCount
        return this
    }

    /**
     * Setting a value in the schema defines a new schema.
     * Shorthand for using a partial `setSchema` call.
     * @param key <String> prop key
     * @param value <?> prop value
     * @return this
     */
    set( key, value ) {
        // Transform key, value into an object and push onto schema stack
        this.setSchema({ [ key ]: value } )
        return this
    }

    /**
     * Returns the key associated with a schema.
     * During the interpolation phase between schemas this will handle that so
     * that the consumer just makes the request and ignores implementation.
     * @param key <String> the prop key to retrieve/calculate
     * @return <?> the value currently associated with the schema key, returns
     *   null if no key exists
     */
    get( key ) {
        // With only one schema just return the value
        if ( this[ schemas ].length === 1 ) {
            if ( !this[ schemas ][ 0 ].hasOwnProperty( key ) ) {
                return null
            }

            return this[ schemas ][ 0 ][ key ]
        }

        // If more than one schema exists on the stack then interpolate between
        // 0 and 1 and return the result. Kill 0 is the interpolation phase has
        // been reached.
        if ( !this[ schemas ][ 0 ][ key ] || !this[ schemas ][ 1 ][ key ] ) {
            return null
        }

        // For now hardcode the interpolation based on property name
        var result = null

        if ( interpolate[ key ] ) {
            // Interpolate from 0 to 1
            result = interpolate[ key ]( 1 - this.count / this.opts.maxCount, this[ schemas ][ 0 ][ key ], this[ schemas ][ 1 ][ key ] )
        } else {
            result = this[ schemas ][ 1 ][ key ]
        }

        // Reduce the count of the interpolation phase and nuke the old schema
        // if we're at the end of it
        // @TODO do this at the end of the tick and do it only once
        if ( --this.count === 0 ) {
            this[ schemas ].shift()

            if ( this[ schemas ].length > 1 ) {
                this.count = this.opts.maxCount
            }
        }

        // Result should be populated with something here
        if ( !result ) {
            throw new Error( 'Get key ' + key + ' is trying to return null. Something bad happened.' )
        }

        return result
    }

}
