import * as PIXI from "pixi.js";

export class CounterText extends PIXI.Text {
  private _value = 0;

  public constructor() {
    super();
    this.update();
  }

  public countUp(): void {
    this._value += 1;
    this.update();
  }

  private update() {
    this.text = `Count: ${this._value}`;
  }
}
