
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'
import Bezier from 'bezier-easing'

import 'core/canvas'
import { stats, memstats } from 'core/stats'
import renderer from 'core/renderer'

import CONSTANTS from 'core/constants'
import Starfield from '../../lib'

var MOVESPEED = 24

window.renderer = renderer
window.Pixi = Pixi
window.Schema = require( '../../lib/schema' )

var starfield = window.starfield = null
var clouds = window.clouds = null
var dust = window.dust = null

var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )
var dustpos = window.dustpos = new Pixi.Point( 0, 0 )

var bloom = window.bloom = new Pixi.filters.BloomFilter()
//stage.filters = [ bloom ]

// Linearly move the starfield to test stuff
quay.on( '<up>', event => {
    pos.y -= .5
    dustpos.y -= .75

    if ( quay.pressed.has( '<shift>' ) ) {
        pos.y -= MOVESPEED / 6
        dustpos.y -= MOVESPEED
    }

    starfield.setPosition( pos.x, pos.y )
    clouds.setPosition( pos.x, pos.y )
    dust.setPosition( dustpos.x, dustpos.y )
})
quay.on( '<down>', event => {
    pos.y += .5
    dustpos.y += .75

    if ( quay.pressed.has( '<shift>' ) ) {
        pos.y += MOVESPEED / 6
        dustpos.y += MOVESPEED
    }

    starfield.setPosition( pos.x, pos.y )
    clouds.setPosition( pos.x, pos.y )
    dust.setPosition( dustpos.x, dustpos.y )
})
quay.on( '<left>', event => {
    pos.x -= .5
    dustpos.x -= .75

    if ( quay.pressed.has( '<shift>' ) ) {
        pos.x -= MOVESPEED / 6
        dustpos.x -= MOVESPEED
    }

    starfield.setPosition( pos.x, pos.y )
    clouds.setPosition( pos.x, pos.y )
    dust.setPosition( dustpos.x, dustpos.y )
})
quay.on( '<right>', event => {
    pos.x += .5
    dustpos.x += .75

    if ( quay.pressed.has( '<shift>' ) ) {
        pos.x += MOVESPEED / 6
        dustpos.x += MOVESPEED
    }

    starfield.setPosition( pos.x, pos.y )
    clouds.setPosition( pos.x, pos.y )
    dust.setPosition( dustpos.x, dustpos.y )
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
                from: [ 0xdd, 0x14, 0x8d ],
                to: [ 0x50, 0x30, 0xc8 ]
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

    dust = window.dust = new Starfield({
        schema: {
            tex: [
                Pixi.loader.resources[ '../common/circle4.png' ].texture
            ],
            alpha: {
                min: .1,
                max: .35
            },
            scale: {
                min: .4,
                max: .75
            },
            rotation: false,
            tempCurve: new Bezier( .75, .1, .85, 1 ),
            threshold: .1
        },
        density: .0025 * window.innerWidth * window.innerHeight,
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
        // filters: [ bloom ]
    })

    stage.addChild( starfield.container )
    stage.addChild( clouds.container )
    stage.addChild( dust.container )

    render()
    resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        memstats.begin()

        starfield.update()
        clouds.update()
        dust.update()

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
