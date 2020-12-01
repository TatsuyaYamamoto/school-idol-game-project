import { TextStyle, Text } from "pixi.js";
import TextStyleOptions = PIXI.TextStyleOptions;

const style: TextStyleOptions = {
  fontFamily: "PixelMplus10-Regular",
  fontSize: 30,
  textBaseline: "middle",
  lineHeight: 35, // prevent to cut off words with PixelMplus10-Regular font.
};

class BrandLogoText extends Text {
  constructor(text: string) {
    super(text, new TextStyle(style));
    this.anchor.set(0.5, 1);
  }
}

export default BrandLogoText;
