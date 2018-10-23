/**
 * @fileOverview BrandLogoAnimation module.
 * This PIXI container has Sokontokoro-factory logo animation with anim.js.
 * Animation logo font is PixelMplus, {@see http://itouhiro.hatenablog.com/entry/20130602/font}.
 * The font should be loaded out of the module.
 * {@link BrandLogoAnimation#start} return promise instance.
 * This promise's going to resolve on complete animation.
 *
 * @example
 * // PixelMplus10-Regular.css
 * @font-face {
 *   font-family: 'PixelMplus10-Regular';
 *   src: url('./PixelMplus10-Regular.woff');
 * }
 *
 * // load stylesheet to load font.
 * require('[font-dir]/PixelMplus10-Regular.css');
 *
 * // Create the animation instance.
 * const animation = new BrandLogoAnimation();
 *
 * // Start animation.
 * animation
 *   .start()
 *   .then(() => { fire on complete animation! }));
 *
 * @class
 */
import { Container } from "pixi.js";
import * as anime from "animejs";

import BrandLogoText from "./BrandLogoText";
import HammerSprite from "./HammerSprite";

const BRAND_CHARACTERS = ["そ", "こ", "ん", "と", "こ", "ろ", "工", "房"];
const TIMELINE = {
  HAMMER_DELAY: 220,
  SHRINK: 100,
  EXPANSION: 200,
  CHARACTER_WAITING: 200,
  CHARACTER_EXTEND: 100,
  HAMMER_MOVING: 600,
  CHARACTER_BOU_WAITING: 600,
  CHARACTER_BOU_ROTATION: 100
};
const DURATION_SCALE = 1;

class BrandLogoAnimation extends Container {
  private _width: number;
  private _height: number;
  private _timeoutAfterComplete: number;

  private _hammer: HammerSprite;
  private _characters: BrandLogoText[];

  private _hammerTimeLine;
  private _charTimeLine;

  private _promise: Promise<any>;

  constructor(width?, height?) {
    super();

    this._width = width || 400;
    this._height = height || this._width;
    this._timeoutAfterComplete = 500;

    // setup sprites
    this._characters = BRAND_CHARACTERS.map(char => new BrandLogoText(char));
    this._characters.forEach(c => this.addChild(c));

    this._hammer = new HammerSprite();
    this._hammer.position.set(
      this.x + this._width * 0.05,
      this.y - this._height * 0.04
    );
    this.addChild(this._hammer);

    // create animjs timeline instances
    this._hammerTimeLine = anime.timeline();
    this._charTimeLine = anime.timeline();

    // set promise that fire on complete all animation.
    this._promise = Promise.all([
      new Promise(resolve => this._defineHammerTimeLineItems(resolve)),
      new Promise(resolve => this._defineCharacterTimeLineItems(resolve))
    ]);
  }

  /**
   * Start animation.
   *
   * @return {Promise.<*>|*}
   */
  start() {
    this._hammerTimeLine.play();
    this._charTimeLine.play();

    return this._promise;
  }

  _defineHammerTimeLineItems(onComplete) {
    this._hammerTimeLine
      .add({
        targets: this._hammer,
        rotation: [
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE },
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE },
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE },
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE },
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE },
          {
            value: (-90 * Math.PI) / 180,
            duration: TIMELINE.EXPANSION * DURATION_SCALE
          },
          { value: 0, duration: TIMELINE.SHRINK * DURATION_SCALE }
        ],
        easing: "easeOutQuad",
        delay: TIMELINE.HAMMER_DELAY * DURATION_SCALE
      })
      .add({
        targets: this._hammer,
        x: [
          {
            value: this.x + this._width * 0.36,
            easing: "linear",
            duration: TIMELINE.HAMMER_MOVING
          }
        ],
        y: [
          {
            value: this.y - this._height * 0.18,
            easing: "easeOutQuad",
            duration: TIMELINE.HAMMER_MOVING / 2
          },
          {
            value: this.y - this._height * 0.05,
            easing: "easeOutQuad",
            duration: TIMELINE.HAMMER_MOVING / 2
          }
        ],
        rotation: {
          value: 2 * Math.PI * 5 - Math.PI / 4,
          duration: TIMELINE.HAMMER_MOVING,
          easing: "linear"
        },
        complete: () => {
          onComplete && onComplete();
        }
      });
  }

  _defineCharacterTimeLineItems(onComplete) {
    // 各文字の最終的なx方向の位置を計算
    const positions = this._characters.map((c, index, array) => {
      const cellTotal = array.length + 5;
      const cellIndex = index + 3;
      return (cellIndex - cellTotal / 2) / cellTotal;
    });

    this._characters.forEach(c => (c.scale.y = 0));

    this._charTimeLine
      /**
       * 1. Expand and contract with hammer.
       * After complete, change theirs scale to x = 0, y = 1;
       */
      .add({
        targets: this._characters // 'そこんところ' only
          .filter(c => c.text !== "工" && c.text !== "房")
          .map(c => c.scale),
        delay: function(el, i, l) {
          return (
            ((TIMELINE.EXPANSION + TIMELINE.SHRINK) * i + 50) * DURATION_SCALE
          );
        },
        y: [
          {
            value: 1,
            duration: TIMELINE.EXPANSION * DURATION_SCALE,
            easing: "easeInOutExpo"
          },
          {
            value: 0,
            duration: TIMELINE.SHRINK * DURATION_SCALE,
            easing: "easeInQuart"
          }
        ],
        complete: () => {
          this._characters.forEach(c => {
            c.scale.x = 0;
            c.scale.y = 1;
          });
        }
      })
      /**
       * 2-a. Move to each last position.
       */
      .add({
        targets: this._characters,
        x: (el, i, l) => this.x + this._width * positions[i],
        duration: TIMELINE.CHARACTER_EXTEND * DURATION_SCALE,
        delay: function(el, i, l) {
          return TIMELINE.CHARACTER_WAITING * DURATION_SCALE;
        },
        easing: "linear"
      })
      /**
       * 2-b. Reset each scale.
       * Arrange offset time to fire at the same time of 2-a moving.
       */
      .add({
        targets: this._characters.map(c => c.scale),
        x: 1,
        duration: TIMELINE.CHARACTER_EXTEND * DURATION_SCALE,
        offset: `-=${TIMELINE.CHARACTER_EXTEND * DURATION_SCALE}`, // Starts before the previous animation ends
        easing: "linear"
      })
      /**
       * 3. Rotate '房'
       * Fire callback function on complete.
       */
      .add({
        targets: this._characters[7], // '房'
        rotation: Math.PI / 4,
        duration: TIMELINE.CHARACTER_BOU_ROTATION * DURATION_SCALE,
        easing: "linear",
        delay: TIMELINE.CHARACTER_BOU_WAITING * DURATION_SCALE,
        complete: () => {
          setTimeout(
            () => onComplete && onComplete(),
            this._timeoutAfterComplete
          );
        }
      });
  }
}

export default BrandLogoAnimation;
