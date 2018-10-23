import { interaction } from "pixi.js";

import Sprite from "./Sprite";
import { isSupportTouchEvent } from "../../framework/utils";

/**
 * @class
 */
abstract class ClickableSprite extends Sprite {
  /**
   * Set to {@link _onClickListener}
   *
   * @param fn
   */
  public setOnClickListener(fn: (event: interaction.InteractionEvent) => void) {
    this.interactive = true;
    this.on(isSupportTouchEvent() ? "touchstart" : "click", fn);
  }
}

export default ClickableSprite;
