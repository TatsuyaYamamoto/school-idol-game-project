import VerticalText from "../../sprite/text/VerticalText";

/**
 * @class
 */
export class PlayerName extends VerticalText {
  constructor(text: string) {
    super(text, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 20
    });
  }
}

export default PlayerName;
