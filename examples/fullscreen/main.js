
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'
import Bezier from 'bezier-easing'

import 'core/canvas'
import { stats, memstats } from 'core/stats'
import renderer from 'core/renderer'

import CONSTANTS from 'core/constants'
import Starfield from '../../lib'

const MOVESPEED = 6

window.renderer = renderer
window.Pixi = Pixi

var starfield = window.starfield = null
var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )

//var dot = new Pixi.filters.DotScreenFilter()
var bloom = window.bloom = new Pixi.filters.BloomFilter()
// var blur = window.blur = new Pixi.filters.BlurFilter()
// blur.blurX = 20
//stage.filters = [ bloom ]

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
        schema: {
            tex: [
                Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX1' ) ].texture,
                Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX2' ) ].texture
                // Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX3' ) ].texture,
                // Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX4' ) ].texture
            ],
            alpha: {
                min: .15,
                max: .6
            },
            scale: {
                min: .4,
                max: .9
            },
            color: {
                from: [ 0xa4, 0x26, 0xbf ],
                to: [ 0xbb, 0x3b, 0xd8 ]
            },
            rotation: true,
            tempCurve: new Bezier( .75, .1, .85, 1 ),
            threshold: .4
        },
        density: CONSTANTS.get( 'NUM_STARS' ),
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
        // filters: [ bloom ]
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
    .add( CONSTANTS.get( 'STAR_TEX1' ) )
    .add( CONSTANTS.get( 'STAR_TEX2' ) )
    .add( CONSTANTS.get( 'STAR_TEX3' ) )
    .add( CONSTANTS.get( 'STAR_TEX4' ) )
    .load( init )
