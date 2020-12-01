import { TextStyleOptions } from "pixi.js";

import Text from "../../internal/Text";

const defaultStyle: TextStyleOptions = {
  align: "center",
};

class VerticalText extends Text {
  constructor(text: string, style: TextStyleOptions = {}) {
    // insert newline character in character spacing.
    const verticalText = text.replace(/(.)(?=.)/g, "$1\n");
    const verticalStyle: TextStyleOptions = {
      ...defaultStyle,
      ...style,
    };

    super(verticalText, verticalStyle);
  }
}

export default VerticalText;
