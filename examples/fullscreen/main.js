
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import CONSTANTS from 'core/constants'
import Starfield from '../../lib'


window.renderer = renderer
window.Pixi = Pixi

var starfield = window.starfield = null
var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )

// Linearly move the starfield to test stuff
quay.on( '<down>', event => {
    starfield.setPosition( pos.x, pos.y-- )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y-=6 )
    }
})
quay.on( '<up>', event => {
    starfield.setPosition( pos.x, pos.y++ )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y+=6 )
    }
})
quay.on( '<right>', event => {
    starfield.setPosition( pos.x--, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x-=6, pos.y )
    }
})
quay.on( '<left>', event => {
    starfield.setPosition( pos.x++, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x+=6, pos.y )
    }
})

function render() {
    renderer.render( stage )
}

function init() {
    console.log( 'initialising' )
    starfield = window.starfield = new Starfield({
        tex: Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX' ) ].texture,
        alpha: {
            min: .7,
            max: 1
        },
        scale: {
            min: .5,
            max: 1
        },
        color: {
            from: [ 0x40, 0xff, 0x80 ],
            to: [ 0xff, 0xff, 0xff ]
        },
        // density: CONSTANTS.get( 'NUM_STARS' ),
        density: 1,
        // size: {
        //     width: CONSTANTS.get( 'CANVAS_WIDTH' ),
        //     height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        // }
        size: {
            width: 500,
            height: 500
        }
    })

    pos.copy( starfield.pos )

    stage.addChild( starfield.container )

    render()
    resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        starfield.update()
        render()
        stats.end()
    })

window.pause = function() {
    renderTick.pause()
}
window.resume = function() {
    renderTick.resume()
}

pause()

Pixi.loader
    .add( CONSTANTS.get( 'STAR_TEX' ) )
    .load( init )
