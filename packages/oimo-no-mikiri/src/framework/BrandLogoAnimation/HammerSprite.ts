import { Sprite, Texture } from "pixi.js";

import hammerImageBase64 from "./hammerImageBase64";

class HammerSprite extends Sprite {
  constructor() {
    super(Texture.fromImage(hammerImageBase64));
    this.anchor.set(0.5, 1);
  }
}

export default HammerSprite;
