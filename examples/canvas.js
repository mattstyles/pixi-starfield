
import CONSTANTS from './constants'

export const canvas = document.createElement( 'canvas' )
canvas.classList.add( 'js-main' )
canvas.width = CONSTANTS.get( 'CANVAS_WIDTH' ) * CONSTANTS.get( 'CANVAS_DP' )
canvas.height = CONSTANTS.get( 'CANVAS_HEIGHT' ) * CONSTANTS.get( 'CANVAS_DP' )
canvas.style.width = CONSTANTS.get( 'CANVAS_WIDTH' ) + 'px'
canvas.style.height = CONSTANTS.get( 'CANVAS_HEIGHT' ) + 'px'

document.body.appendChild( canvas )
