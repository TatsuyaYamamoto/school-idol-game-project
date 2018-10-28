import { Sprite, Texture } from "pixi.js";

import imageBase64 from "./hammerImageBase64";

class HammerSprite extends Sprite {
  constructor() {
    super(Texture.fromImage(imageBase64));
    this.anchor.set(0.5, 1);
  }
}

export default HammerSprite;
