import { Container } from "pixi.js";
import Text from "../sprite/text/Text";

class UsageTapTargetInfo extends Container {
  private _text: Text;

  constructor() {
    super();

    this._text = new Text(" ↑ \nTap!");
    this._text.position.x = this._text.width * 0.5;

    this.addChild(this._text);
  }
}

export default UsageTapTargetInfo;
