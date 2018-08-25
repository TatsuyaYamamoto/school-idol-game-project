import { Texture } from "pixi.js";

import ClickableSprite from "./ClickableSprite";

class Button extends ClickableSprite {
  public constructor(texture: Texture) {
    super(texture);

    this.buttonMode = true;
  }
}

export default Button;
