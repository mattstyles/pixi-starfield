/**
 * Defines the schema used to render each star.
 * ---
 * When a schema is updated it should slowly interpolate between the old schema
 * and the new one, this becomes even trickier when new schemas are applied
 * in quick succession.
 */

import isPlainObject from 'lodash.isplainobject'
import xtend from 'xtend'
import { lerp } from 'mathutil'

// Private schemas symbol
const schemas = Symbol( 'schemas' )

// Default schema options
const _opts = {
    maxCount: 500
}
// Default schema
var _schema = {
    alpha: {
        min: 0,
        max: 1
    },
    scale: {
        min: .2,
        max: 1
    }
}

// Interpolation functions by property
var interpolate = {
    scale: function( scalar, a, b ) {
        return {
            min: lerp( scalar, a.min, b.min ),
            max: lerp( scalar, a.max, b.max )
        }
    },

    alpha: function( scalar, a, b ) {
        return {
            min: lerp( scalar, a.min, b.min ),
            max: lerp( scalar, a.max, b.max )
        }
    }
}

/**
 * tex <Array>
 * scale <Object> { min <Float>, max <Float> }
 * alpha <Object> { min <Float>, max <Float> }
 * rotation <Boolean>
 * tempCurve <Function>
 * blendMode <Integer>
 * threshold <Float>
 * starmap <HeightMap>
 */
export default class Schema {
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

    setSchema( schema ) {
        if ( !schema || !isPlainObject( schema ) ) {
            throw new TypeError( 'Schema must be specified as a plain object' )
        }

        // Add a new schema onto the stack
        this[ schemas ].push( xtend( this[ schemas ][ this[ schemas ].length - 1 ], schema ) )
        this.count = this.opts.maxCount
    }

    /**
     * Setting a value in the schema defines a new schema
     */
    set( key, value ) {
        // Transform key, value into an object and push onto schema stack
        this.setSchema({ [ key ]: value } )
        return this
    }

    get( key ) {
        // With only one schema just return the value
        if ( this[ schemas ].length === 1 ) {
            if ( !this[ schemas ][ 0 ].hasOwnProperty( key ) ) {
                throw new Error( 'Key ' + key + ' not found on current schema' )
            }

            return this[ schemas ][ 0 ][ key ]
        }

        // If more than one schema exists on the stack then interpolate between
        // 0 and 1 and return the result. Kill 0 is the interpolation phase has
        // been reached.
        if ( !this[ schemas ][ 0 ][ key ] || !this[ schemas ][ 1 ][ key ] ) {
            throw new Error( 'Key ' + key + ' not found on current schema' )
        }

        // For now hardcode the interpolation based on property name
        var result = null

        if ( interpolate[ key ] ) {
            // Interpolate from 0 to 1
            // @TODO if there is no diff between values in schemas then that value
            // should simply be returned
            result = interpolate[ key ]( 1 - this.count / this.opts.maxCount, this[ schemas ][ 0 ][ key ], this[ schemas ][ 1 ][ key ] )
        } else {
            result = this[ schemas ][ 1 ][ key ]
        }

        // Reduce the count of the interpolation phase and nuke the old schema
        // if we're at the end of it
        // @TODO do this at the end of the tick and do it only once
        if ( --this.count === 0 ) {
            this[ schemas ].shift()
        }

        // Result should be populated with something here
        if ( !result ) {
            throw new Error( 'Get key ' + key + ' is trying to return null. Something bad happened.' )
        }

        return result
    }

}
