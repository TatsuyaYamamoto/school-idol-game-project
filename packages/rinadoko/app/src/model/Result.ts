import { Container, Texture, Text, TextStyle, Sprite } from "pixi.js";

export class Result {
  private _container: Container;
  private _text: Text;
  private _result0: Sprite;
  private _result1: Sprite;
  private _result2: Sprite;
  private _point: number = 0;

  public constructor(
    private context: {
      scale: number;
      screen: { width: number; height: number };
      textures: {
        result0: Texture;
        result1: Texture;
        result2: Texture;
      };
    }
  ) {
    this._container = new Container();
    this._container.x = this.context.screen.width * 0.5;
    this._container.y = this.context.screen.height * 0.5;

    this._text = new Text(
      "",
      new TextStyle({
        fontFamily: "PixelMplus12-Bold",
        fontSize: 300 * this.context.scale,
        lineHeight: 400 * this.context.scale
      })
    );
    this._text.anchor.set(0.5);
    this._text.y = -this.context.screen.height * 0.3;

    const imageScaleTuning = 4;
    this._result0 = Sprite.from(context.textures.result0);
    this._result0.anchor.set(0.5);
    this._result0.scale.set(this.context.scale * imageScaleTuning);

    this._result1 = Sprite.from(context.textures.result1);
    this._result1.anchor.set(0.5);
    this._result1.scale.set(this.context.scale * imageScaleTuning);

    this._result2 = Sprite.from(context.textures.result2);
    this._result2.anchor.set(0.5);
    this._result2.scale.set(this.context.scale * imageScaleTuning);
  }

  public get container() {
    return this._container;
  }

  public get point(): number {
    return this._point;
  }

  public set point(point: number) {
    this._point = point;

    if (point === 0) {
      this._text.text = `ぜんぜん\n見つけられ\nなかった...`;
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
