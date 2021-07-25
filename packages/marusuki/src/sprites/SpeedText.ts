import * as PIXI from "pixi.js";

export class SpeedText extends PIXI.Text {
  public constructor(private _value: number) {
    super();
    this.update();
  }

  public change(newValue: number): void {
    this._value = newValue;
    this.update();
  }

  private update() {
    this.text = `Speed: ${this._value}`;
  }
}
