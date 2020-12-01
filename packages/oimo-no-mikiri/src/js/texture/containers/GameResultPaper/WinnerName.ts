import Text from "../../internal/Text";

/**
 * @class
 */
export class WinnerName extends Text {
  constructor(text: string) {
    super(text, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 40,
      fill: "#ff504d",
      stroke: "#ed514e",
      strokeThickness: 2,
      padding: 5, // prevent to cut off words.
    });
  }
}

export default WinnerName;
