import * as PIXI from "pixi-v6";
import { SpriteMap } from "../helper/loader";

export class PointCounter extends PIXI.Container {
  private _value = 0;

  private countText: PIXI.Text;

  private countLabel: PIXI.Sprite;

  public get value(): number {
    return this._value;
  }

  public constructor(params: { spriteMap: SpriteMap }) {
    super();

    this.countText = new PIXI.Text("");
    this.countText.anchor.set(0, 0.5);
    this.updateCounter();

    const labelTexture = params.spriteMap.touch_target_ok_takoyaki_1
      .texture as PIXI.Texture;
    this.countLabel = new PIXI.Sprite(labelTexture);
    this.countLabel.anchor.set(1, 0.5);

    this.addChild(this.countLabel, this.countText);
  }

  public setScale(scale: number): void {
    this.countText.scale.set(scale);
    this.countLabel.scale.set(scale * 0.1);
  }

  public countUp(): void {
    this._value += 1;
    this.updateCounter();
  }

  public reset(): void {
    this._value = 0;
    this.updateCounter();
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  private updateCounter() {
    this.countText.text = `x ${this._value}`;
  }
}
