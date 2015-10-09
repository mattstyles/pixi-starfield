import toMap from './toMap'

const CONSTANTS = toMap({
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    CANVAS_DP: window.devicePixelRatio,

    // .05% of screen density .0005
    NUM_STARS: .0005 * window.innerWidth * window.innerHeight,
    STAR_TEX1: '../common/dc512-1.png',
    STAR_TEX2: '../common/dc512-2.png',
    STAR_TEX3: '../common/cloud512-2.png',
    STAR_TEX4: '../common/cloud512-3.png'
})

export default CONSTANTS
