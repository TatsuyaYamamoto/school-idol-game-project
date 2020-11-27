import { Container, DisplayObject, Graphics } from "pixi.js";
import { t } from "@sokontokoro/mikan";

import Text from "../internal/Text";

import { Ids } from "../../resources/string";

class UsageTextArea extends Container {
  private _text: Text;
  private _roundedRectangle: Graphics;

  constructor() {
    super();

    this._text = new Text(t(Ids[Ids.HOW_TO_PLAY_INFORMATION]), {
      fontSize: 16,
    });

    const rectWidth = this._text.width * 1.2;
    const rectHeight = this._text.height * 1.2;

    this._roundedRectangle = new Graphics();
    this._roundedRectangle.beginFill(0xffffff, 0.6);
    this._roundedRectangle.drawRoundedRect(
      -1 * rectWidth * 0.5,
      -1 * rectHeight * 0.5,
      rectWidth,
      rectHeight,
      15
    );
    this._roundedRectangle.endFill();

    this.addChild<DisplayObject>(this._roundedRectangle, this._text);
  }
}

export default UsageTextArea;
