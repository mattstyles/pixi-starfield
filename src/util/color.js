
import { lerp } from 'mathutil'

/**
 * @function colourToValue
 * @param mag <Array:Float || Float> 0...1 magnitude for each colour component
 * @param from <Array:Integer> rgb colour as integers 0...255
 * @param to <Array:Integer> rgb colour as integers 0...255
 * @returns <Integer> colour value
 * Interpolates between the from and to colours using the magnitude as an interpolator.
 * @TODO error checking, testing, perf testing
 */
export function colourToValue( mag = [ .5, .5, .5 ], from = [ 0, 0, 0 ], to = [ 255, 255, 255 ] ) {
    // Map magnitude to an array if its given as a float
    if ( typeof mag === 'number' ) {
        mag = [ mag, mag, mag ]
    }

    // Return the colour value from the given params
    return [
        lerp( mag[ 0 ], from[ 0 ], to[ 0 ] ) << 16,
        lerp( mag[ 1 ], from[ 1 ], to[ 1 ] ) << 8,
        lerp( mag[ 2 ], from[ 2 ], to[ 2 ] )
    ].reduce( ( prev, curr ) => {
        return prev | curr
    }, 0 )
}
