import * as PIXI from "pixi-v6";

export class SpeedText extends PIXI.Text {
  public constructor(private _value: number) {
    super(`${_value}`);
    this.anchor.set(0.5);
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
