import { Container, Graphics } from "pixi.js";
import Sprite from "../sprite/Sprite";
import Kotori from "../sprite/character/Kotori";
import Text from "../sprite/text/Text";

class GamePointCount extends Container {
  private _point: number = 0;
  private _kotoriIcon: Sprite;
  private _text: Text;
  private _roundedRectangle: Graphics;

  constructor() {
    super();
    this._kotoriIcon = new Kotori();
    this._kotoriIcon.scale.set(this._kotoriIcon.scale.x * 0.3);
    this._kotoriIcon.position.x = -1 * this._kotoriIcon.width * 0.5;

    this._text = new Text(`× ${this._point}`);
    this._text.position.x = this._text.width * 0.5;

    const width = this._kotoriIcon.width + this._text.width;
    const height = this._kotoriIcon.height;

    this._roundedRectangle = new Graphics();
    this._roundedRectangle.beginFill(0x001111, 0.25);
    this._roundedRectangle.drawRoundedRect(
      -1 * width * 0.5,
      -1 * height * 0.5,
      width,
      height,
      15
    );
    this._roundedRectangle.endFill();

    this.addChild(this._roundedRectangle, this._kotoriIcon, this._text);
  }

  get point(): number {
    return this._point;
  }

  set point(point: number) {
    this._point = point;
    this._text.text = `× ${this._point}`;
  }
}

export default GamePointCount;
