import toMap from './toMap'

const CONSTANTS = toMap({
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    CANVAS_DP: window.devicePixelRatio,

    // .05% of screen density
    NUM_STARS: .0005 * window.innerWidth * window.innerHeight,
    STAR_TEX: 'assets/circle32.png',
})

export default CONSTANTS
