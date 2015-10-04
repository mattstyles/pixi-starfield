
import Pixi from 'pixi.js'

import { canvas } from './canvas'
import CONSTANTS from './constants'

const renderer = Pixi.autoDetectRenderer( CONSTANTS.get( 'CANVAS_WIDTH' ), CONSTANTS.get( 'CANVAS_HEIGHT' ), {
    antialiasing: false,
    transparent: false,
    resolution: CONSTANTS.get( 'CANVAS_DP' ),
    view: canvas
})

document.body.appendChild( renderer.view )

export default renderer
