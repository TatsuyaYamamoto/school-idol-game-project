import { Sprite as PixiSprite, Texture } from "pixi.js";

abstract class Sprite extends PixiSprite {
  public constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
  }
}

export default Sprite;
