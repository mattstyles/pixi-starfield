
import { lerp } from 'mathutil'

export function colorToVal( value, from = [ 0, 0, 0 ], to = [ 255, 255, 255 ] ) {
    return [
        lerp( value, from[ 0 ], to[ 0 ] ) << 16,
        lerp( value, from[ 1 ], to[ 1 ] ) << 8,
        lerp( value, from[ 2 ], to[ 2 ] )
    ].reduce( ( prev, curr ) => {
        return prev | curr
    }, 0 )
}
