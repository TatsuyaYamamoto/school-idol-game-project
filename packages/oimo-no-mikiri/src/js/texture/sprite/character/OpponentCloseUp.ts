import { Texture } from "pixi.js";

import Sprite from "../../internal/Sprite";

abstract class OpponentCloseUp extends Sprite {
  public constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0, 1);
  }
}

export default OpponentCloseUp;
