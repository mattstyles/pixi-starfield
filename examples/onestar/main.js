
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'
import Bezier from 'bezier-easing'

// import 'core/canvas'
import { stats, memstats } from 'core/stats'
// import renderer from 'core/renderer'

const WIDTH = 500
const HEIGHT = 500

const renderer = Pixi.autoDetectRenderer( WIDTH, HEIGHT, {
    antialiasing: false,
    transparent: false,
    resolution: CONSTANTS.get( 'CANVAS_DP' ),
    view: document.querySelector( '.js-canvas' )
})


import CONSTANTS from 'core/constants'
import Starfield from '../../lib'

const MOVESPEED = 6

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
        schema: {
            tex: [
                Pixi.loader.resources[ '../common/circle32.png' ].texture
            ],
            alpha: {
                min: 1,
                max: 1
            },
            scale: {
                min: 1,
                max: 1
            },
            color: {
                from: [ 0xa4, 0x26, 0xbf ],
                to: [ 0xbb, 0x3b, 0xd8 ]
            },
            rotation: false,
            tempCurve: new Bezier( .75, .1, .85, 1 ),
            threshold: 0
        },
        density: 1,
        size: {
            width: WIDTH,
            height: HEIGHT
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
    .add( '../common/circle32.png' )
    .load( init )
