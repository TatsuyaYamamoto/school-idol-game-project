import * as PIXI from "pixi-v6";

export class PointCounter extends PIXI.Container {
  private _value = 0;

  private countText: PIXI.Text;

  private countLabel: PIXI.Sprite;

  public get value(): number {
    return this._value;
  }

  public constructor(params: { labelTexture: PIXI.Texture }) {
    super();

    this.countText = new PIXI.Text("");
    this.countText.anchor.set(0, 0.5);
    this.updateCounter();

    this.countLabel = new PIXI.Sprite(params.labelTexture);
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

  private updateCounter() {
    this.countText.text = `x ${this._value}`;
  }
}
