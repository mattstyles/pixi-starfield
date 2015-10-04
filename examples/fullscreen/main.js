
import Pixi from 'pixi.js'

import '../canvas'
import renderer from '../renderer'
import CONSTANTS from '../constants'

import Starfield from '../../lib'

let starfield = null
let stage = new Pixi.Container()

function render() {
    console.log( 'rendering' )
    renderer.render( stage )
}

function init() {
    console.log( 'initialising' )
    starfield = new Starfield({
        tex: Pixi.loader.resources[ CONSTANTS.get( 'STAR_TEX' ) ].texture,
        alpha: {
            min: .9,
            max: 1
        },
        density: 10000
    })
    window.stars = starfield

    stage.addChild( starfield.container )

    render()
}


Pixi.loader
    .add( CONSTANTS.get( 'STAR_TEX' ) )
    .load( init )


window.stars = starfield
window.stage = stage
window.renderer = renderer
window.Pixi = Pixi
