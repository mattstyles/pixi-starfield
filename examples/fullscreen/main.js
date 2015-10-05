
import Pixi from 'pixi.js'
import Quay from 'quay'
import Tick from '@mattstyles/tick'

import '../canvas'
import stats from '../stats'
import renderer from '../renderer'

import CONSTANTS from '../constants'
import Starfield from '../../lib'


window.renderer = renderer
window.Pixi = Pixi

var starfield = window.starfield = null
var stage = window.stage = new Pixi.Container()

function render() {
    renderer.render( stage )
}

function init() {
    console.log( 'initialising' )
    starfield = new Starfield({
        tex: Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX' ) ].texture,
        alpha: {
            min: .2,
            max: 1
        },
        scale: {
            min: .085,
            max: .1
        },
        density: CONSTANTS.get( 'NUM_STARS' ),
        size: {
            width: CONSTANTS.get( 'CANVAS_WIDTH' ),
            height: CONSTANTS.get( 'CANVAS_HEIGHT' )
        }
    })

    stage.addChild( starfield.container )

    render()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()
        render()
        stats.end()
    })

window.pause = function() {
    renderTick.pause()
}
window.resume = function() {
    renderTick.resume()
}

Pixi.loader
    .add( CONSTANTS.get( 'STAR_TEX' ) )
    .load( init )
