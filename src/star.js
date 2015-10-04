
import Pixi from 'pixi.js'


/**
 * Individual star class
 * @class
 * ---
 * Wraps Pixi.Sprite with a few star specific helpers
 */
export default class Star {
    constructor( tex ) {
        this.spr = new Pixi.Sprite( tex )
    }
}
