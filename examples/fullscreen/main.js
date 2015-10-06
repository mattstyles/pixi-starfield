
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'
import Bezier from 'bezier-easing'

import 'core/canvas'
import { stats, memstats } from 'core/stats'
import renderer from 'core/renderer'

import CONSTANTS from 'core/constants'
import Starfield from '../../lib'

const MOVESPEED = 10

window.renderer = renderer
window.Pixi = Pixi

var starfield = window.starfield = null
var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )

// Linearly move the starfield to test stuff
quay.on( '<up>', event => {
    starfield.setPosition( pos.x, pos.y-- )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y-=MOVESPEED )
    }
})
quay.on( '<down>', event => {
    starfield.setPosition( pos.x, pos.y++ )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y+=MOVESPEED )
    }
})
quay.on( '<left>', event => {
    starfield.setPosition( pos.x--, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x-=MOVESPEED, pos.y )
    }
})
quay.on( '<right>', event => {
    starfield.setPosition( pos.x++, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x+=MOVESPEED, pos.y )
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
            min: .2,
            max: 1
        },
        scale: {
            min: .085,
            max: .125
        },
        density: CONSTANTS.get( 'NUM_STARS' ),
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
    })

    stage.addChild( starfield.container )

    render()
    resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        memstats.begin()

        starfield.update()
        render()

        memstats.end()
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


import { colourToValue } from '../../lib/util/color'
window.color = colourToValue
