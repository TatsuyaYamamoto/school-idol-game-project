import * as PIXI from "pixi-v6";

export class CounterText extends PIXI.Text {
  private _value = 0;

  public constructor(private _label: string = "") {
    super(_label);
    this.update();
  }

  public countUp(): void {
    this._value += 1;
    this.update();
  }

  private update() {
    this.text = `${this._label}${this._value}`;
  }
}
