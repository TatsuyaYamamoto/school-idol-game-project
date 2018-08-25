import { interaction } from "pixi.js";
import { isSupportTouchEvent } from "mikan";

import Sprite from "./Sprite";

/**
 * @class
 */
abstract class ClickableSprite extends Sprite {
  public setOnClickListener(fn: (event: interaction.InteractionEvent) => void) {
    this.interactive = true;
    this.on(isSupportTouchEvent() ? "touchstart" : "click", fn);
  }
}

export default ClickableSprite;
