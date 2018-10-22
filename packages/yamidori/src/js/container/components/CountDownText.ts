import { Container } from "pixi.js";
import Text from "../sprite/text/Text";

class CountDownText extends Container {
  private _text: Text;

  constructor() {
    super();
    this._text = new Text("");
    this.addChild(this._text);
  }

  set count(count: number) {
    this._text.text = `-${count}-`;
  }
}

export default CountDownText;
