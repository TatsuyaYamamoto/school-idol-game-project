import * as PIXI from "pixi-v6";

export class GameoverEffect extends PIXI.Sprite {
  public constructor(params: { texture: PIXI.Texture }) {
    super(params.texture);
    this.anchor.set(0.5);
  }

  public setScale(value: number): void {
    this.scale.set(value);
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}
