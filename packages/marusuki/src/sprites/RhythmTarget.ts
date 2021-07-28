import * as PIXI from "pixi.js";

export class RhythmTarget extends PIXI.Sprite {
  public constructor(
    private textures: { normal: PIXI.Texture; crush: PIXI.Texture }
  ) {
    super(textures.normal);
    this.anchor.set(0.5);
    this.interactive = true;
    this.visible = false;
    this.scale.set(1.5);
  }

  show() {
    this.texture = this.textures.normal;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  crush() {
    this.texture = this.textures.crush;
  }
}
