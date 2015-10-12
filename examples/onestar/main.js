
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

const MOVESPEED = 10

window.renderer = renderer
window.Pixi = Pixi

var starfield = window.starfield = null
var stage = window.stage = new Pixi.Container()
var quay = new Quay()
var pos = window.pos = new Pixi.Point( 0, 0 )


var fieldX = document.querySelector( '.js-showcontainer > .x' )
var fieldY = document.querySelector( '.js-showcontainer > .y' )
var starX = document.querySelector( '.js-showstar > .x' )
var starY = document.querySelector( '.js-showstar > .y' )

// Linearly move the starfield to test stuff
quay.on( '<up>', event => {
    if ( quay.pressed.has( '<shift>' ) ) {
        pos.y-=MOVESPEED
        return
    }
    pos.y--
})
quay.on( '<down>', event => {
    if ( quay.pressed.has( '<shift>' ) ) {
        pos.y+=MOVESPEED
        return
    }
    pos.y++
})
quay.on( '<left>', event => {
    if ( quay.pressed.has( '<shift>' ) ) {
        pos.x-=MOVESPEED
        return
    }
    pos.x--
})
quay.on( '<right>', event => {

    if ( quay.pressed.has( '<shift>' ) ) {
        pos.x+=MOVESPEED
        return
    }
    pos.x++
})

function render() {
    renderer.render( stage )
}

function renderShow() {
    fieldX.innerHTML = starfield.pos.x
    fieldY.innerHTML = starfield.pos.y
    starX.innerHTML = star.position.x
    starY.innerHTML = star.position.y
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

    window.star = starfield.stars[ 0 ]
    window.star.setPosition( 0, 0 )

    stage.addChild( starfield.container )

    render()
    resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        memstats.begin()

        starfield.setPosition( pos.x, pos.y )
        starfield.update()
        render()
        renderShow()

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
