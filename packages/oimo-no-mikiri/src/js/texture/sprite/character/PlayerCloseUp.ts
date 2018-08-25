import { Texture } from "pixi.js";

import Sprite from "../../internal/Sprite";

abstract class PlayerCloseUp extends Sprite {
  public constructor(texture: Texture) {
    super(texture);
    this.anchor.set(1, 0);
  }
}

export default PlayerCloseUp;
