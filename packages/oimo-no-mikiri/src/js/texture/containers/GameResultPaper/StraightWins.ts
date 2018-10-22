import { Container } from "pixi.js";

import { t } from "@sokontokoro/mikan";

import Text from "../../internal/Text";

import { Ids as StringIds } from "../../../resources/string";

class StraightWins extends Container {
  private _label: Text;
  private _value: Text;

  constructor(wins: number) {
    super();
    this._label = new Text(t(StringIds[StringIds.LABEL_STRAIGHT_WINS]), {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 50,
      padding: 5 // prevent to cut off words.
    });

    this._value = new Text(`${wins}`, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 60,
      padding: 5 // prevent to cut off words.
    });

    // Set position to be set center as anchor.
    const totalWidth = this._label.width + this._value.width;
    this._value.position.x = -1 * totalWidth * 0.5 + this._value.width * 0.5;
    this._label.position.x = totalWidth * 0.5 - this._label.width * 0.5;

    this.addChild(this._label, this._value);
  }
}

export default StraightWins;
