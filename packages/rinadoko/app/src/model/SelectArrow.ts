import { Graphics } from "pixi.js";

export class SelectArrow {
  private _graphics: Graphics;

  constructor() {
    this._graphics = new Graphics();
    this._graphics.beginFill(0xff3300);
    this._graphics.lineStyle(4, 0xffd900, 1);
    this._graphics.moveTo(-50, 0);
    this._graphics.lineTo(50, 0);
    this._graphics.lineTo(0, 50);
    this._graphics.lineTo(-50, 0);
    this._graphics.closePath();
    this._graphics.endFill();
  }

  public get graphics() {
    return this._graphics;
  }
}
