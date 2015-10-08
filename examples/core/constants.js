import toMap from './toMap'

const CONSTANTS = toMap({
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    CANVAS_DP: window.devicePixelRatio,

    // .05% of screen density .0005
    NUM_STARS: .001 * window.innerWidth * window.innerHeight,
    STAR_TEX: '../common/cloud128-1.png',
})

export default CONSTANTS
