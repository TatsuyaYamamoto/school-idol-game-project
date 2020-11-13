import * as PIXI from "pixi.js";
import { TimelineMax } from "gsap";

import { SelectArrow } from "./SelectArrow";

export class Result {
  private _container: PIXI.Container;
  private _text: PIXI.Text;
  private _result0: PIXI.Sprite;
  private _result1: PIXI.Sprite;
  private _result2: PIXI.Sprite;

  public constructor(
    private context: {
      scale: number;
      screen: { width: number; height: number };
      textures: {
        result0: PIXI.Texture;
        result1: PIXI.Texture;
        result2: PIXI.Texture;
      };
    }
  ) {
    this._container = new PIXI.Container();
    this._container.x = this.context.screen.width * 0.5;
    this._container.y = this.context.screen.height * 0.5;

    this._text = new PIXI.Text(
      "",
      new PIXI.TextStyle({
        fontFamily: "PixelMplus12-Bold",
        fontSize: 300 * this.context.scale,
        lineHeight: 400 * this.context.scale
      })
    );
    this._text.anchor.set(0.5);
    this._text.y = -this.context.screen.height * 0.3;

    const imageScaleTuning = 4;
    this._result0 = PIXI.Sprite.from(context.textures.result0);
    this._result0.anchor.set(0.5);
    this._result0.scale.set(this.context.scale * imageScaleTuning);

    this._result1 = PIXI.Sprite.from(context.textures.result1);
    this._result1.anchor.set(0.5);
    this._result1.scale.set(this.context.scale * imageScaleTuning);

    this._result2 = PIXI.Sprite.from(context.textures.result2);
    this._result2.anchor.set(0.5);
    this._result2.scale.set(this.context.scale * imageScaleTuning);
  }

  public get container() {
    return this._container;
  }

  public set point(point: number) {
    if (point === 0) {
      this._text.text = `ぜんぜん\n見つけられなかった...`;
      this._container.addChild(this._result0);
      this._container.addChild(this._text);
    } else if (point < 10) {
      this._text.text = `${point}回\n見つけられたよ！`;
      this._container.addChild(this._result1);
      this._container.addChild(this._text);
    } else {
      this._text.text = `${point}回\n見つけられたよ！`;
      this._container.addChild(this._result2);
      this._container.addChild(this._text);
    }
  }
}
