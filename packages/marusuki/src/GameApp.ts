import * as PIXI from "pixi-v6";
import { calcGameWindowSize } from "./helper/utils";

export class GameApp extends PIXI.Application {
  private _scale: number;

  public get scale(): number {
    return this._scale;
  }

  public get width(): number {
    return this.renderer.width;
  }

  public get height(): number {
    return this.renderer.height;
  }

  constructor() {
    const { width, height, scale } = calcGameWindowSize(3 / 4, 800);
    super({
      // backgroundColor: parseInt("#f3f2f2".replace("#", ""), 16),
      backgroundAlpha: 0,
      width,
      height,
    });
    this._scale = scale;
  }

  public getX(ratio: number): number {
    return this.renderer.width * ratio;
  }

  public getY(ratio: number): number {
    return this.renderer.height * ratio;
  }
}
