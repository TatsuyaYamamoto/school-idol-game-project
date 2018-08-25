import { extras, Texture } from "pixi.js";

class AnimatedSprite extends extras.AnimatedSprite {
  constructor(
    textures: Texture[] | extras.AnimatedSpriteTextureTimeObject[],
    autoUpdate?: boolean
  ) {
    super(textures, autoUpdate);
    this.anchor.set(0.5);
  }
}

export default AnimatedSprite;
