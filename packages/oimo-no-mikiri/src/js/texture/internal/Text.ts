import { Text as PixiText, TextStyle, TextStyleOptions } from "pixi.js";

export const basicTextStyle = {};

class Text extends PixiText {
  constructor(text: string, style?: TextStyleOptions) {
    super(text, new TextStyle(Object.assign({}, basicTextStyle, style)));
    this.anchor.set(0.5);
  }
}

export default Text;
