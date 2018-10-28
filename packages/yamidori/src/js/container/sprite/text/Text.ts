import { Text as PixiText, TextStyle } from "pixi.js";

export const basicTextStyle = {
  fontFamily: "Arial",
  fontSize: 36,
  stroke: "#4a1850",
  strokeThickness: 1
};

class Text extends PixiText {
  constructor(text: string, style?: object) {
    super(text, new TextStyle(Object.assign({}, basicTextStyle, style)));
    this.anchor.set(0.5);
  }
}

export default Text;
