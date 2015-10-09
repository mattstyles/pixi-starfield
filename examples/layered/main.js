
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
var clouds = window.clouds = null

var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )

var bloom = window.bloom = new Pixi.filters.BloomFilter()
//stage.filters = [ bloom ]

// Linearly move the starfield to test stuff
quay.on( '<up>', event => {
    starfield.setPosition( pos.x, pos.y-- )
    clouds.setPosition( pos.x, pos.y-- )

    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y-=MOVESPEED )
        clouds.setPosition( pos.x, pos.y-=MOVESPEED )
    }
})
quay.on( '<down>', event => {
    starfield.setPosition( pos.x, pos.y++ )
    clouds.setPosition( pos.x, pos.y++ )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x, pos.y+=MOVESPEED )
        clouds.setPosition( pos.x, pos.y+=MOVESPEED )
    }
})
quay.on( '<left>', event => {
    starfield.setPosition( pos.x--, pos.y )
    clouds.setPosition( pos.x--, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x-=MOVESPEED, pos.y )
        clouds.setPosition( pos.x-=MOVESPEED, pos.y )
    }
})
quay.on( '<right>', event => {
    starfield.setPosition( pos.x++, pos.y )
    clouds.setPosition( pos.x++, pos.y )
    if ( quay.pressed.has( '<shift>' ) ) {
        starfield.setPosition( pos.x+=MOVESPEED, pos.y )
        clouds.setPosition( pos.x+=MOVESPEED, pos.y )
    }
})

function render() {
    renderer.render( stage )
}

function init() {
    console.log( 'initialising' )
    clouds = window.clouds = new Starfield({
        schema: {
            tex: [
                Pixi.loader.resources[ '../common/dc512-1.png' ].texture,
                Pixi.loader.resources[ '../common/dc512-2.png' ].texture
            ],
            alpha: {
                min: .18,
                max: .34
            },
            scale: {
                min: .3,
                max: .8
            },
            color: {
                from: [ 0xa4, 0x26, 0xbf ],
                to: [ 0xbb, 0x3b, 0xd8 ]
            },
            rotation: true,
            tempCurve: new Bezier( .75, .1, .85, 1 ),
            threshold: .4
        },
        density: .0002 * window.innerWidth * window.innerHeight,
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
        // filters: [ bloom ]
    })

    starfield = window.starfield = new Starfield({
        schema: {
            tex: [
                Pixi.loader.resources[ '../common/circle4.png' ].texture
            ],
            alpha: {
                min: .2,
                max: 1
            },
            scale: {
                min: .25,
                max: .8
            },
            rotation: false,
            tempCurve: new Bezier( .75, .1, .85, 1 ),
            threshold: .05
        },
        density: .0005 * window.innerWidth * window.innerHeight,
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
        // filters: [ bloom ]
    })

    stage.addChild( starfield.container )
    stage.addChild( clouds.container )

    render()
    resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        memstats.begin()

        starfield.update()
        clouds.update()
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
    .add( '../common/dc512-1.png' )
    .add( '../common/dc512-2.png' )
    .add( '../common/circle4.png' )
    .load( init )
