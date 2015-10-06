/**
 * Generates functions to procedurally generate stars
 */

import HeightMap from 'heightmap'
import FastSimplex from 'fast-simplex-noise'

/**
 * @function simplex
 * @param opts <Object> simplex control variables
 * Creates simplex generator function
 */
function simplex( opts ) {
    const fastSimplex = new FastSimplex( Object.assign({
        min: 0,
        max: 1,
        octaves: 4,
        frequency: .01,
        persistence: .5,
        amplitude: 1
    }, opts ))

    return function( x, y ) {
        return fastSimplex.get2DNoise( x, y )
    }
}

/**
 * @constant FREQ
 * Controls the frequency of the simplex wave i.e. higher numbers result
 * in larger areas of proximity (translates into larger areas of light and
 * dark stars in the starfield)
 */
const FREQ = 9

/**
 * @function stars( x, y )
 * @param x <Integer>
 * @param y <Integer>
 * @returns <Double> clamped 0...1
 * Returns heightmap values that will ultimately determine the brightness of
 * stars within the starfield
 */
const stars = new HeightMap()
    .generator({
        weight: 1,
        fn: simplex({
            min: .25,
            max: 1,
            octaves: 4,
            persistence: 1 / Math.pow( 2, 4 ),
            frequency: 1 / Math.pow( 2, FREQ )
        })
    })

export default stars
