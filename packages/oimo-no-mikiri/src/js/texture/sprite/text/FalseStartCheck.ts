import Text from "../../internal/Text";
import TextStyleOptions = PIXI.TextStyleOptions;

const defaultStyle: TextStyleOptions = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 70,
  fill: 0xffffff
};

class FalseStartCheck extends Text {
  constructor(style: TextStyleOptions = {}) {
    const verticalText = "×";
    const verticalStyle: TextStyleOptions = Object.assign(
      {},
      defaultStyle,
      style
    );

    super(verticalText, verticalStyle);
  }
}

export default FalseStartCheck;
