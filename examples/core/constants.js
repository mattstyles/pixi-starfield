import toMap from './toMap'

const CONSTANTS = toMap({
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    CANVAS_DP: window.devicePixelRatio,

    // .05% of screen density .0005
    NUM_STARS: .005 * window.innerWidth * window.innerHeight,
    STAR_TEX1: '../common/cloud128-1.png',
    STAR_TEX2: '../common/cloud256-1.png',
    STAR_TEX3: '../common/cloud256-2.png'
})

export default CONSTANTS
