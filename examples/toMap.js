
export default function( obj ) {
    let map = new Map()
    for( var prop in obj ) {
        if ( obj.hasOwnProperty( prop ) ) {
            map.set( prop, obj[ prop ] )
        }
    }

    return map
}
