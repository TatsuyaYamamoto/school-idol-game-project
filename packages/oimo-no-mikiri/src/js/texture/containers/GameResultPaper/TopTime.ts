import { Container } from "pixi.js";

import { t } from "../../../../framework/i18n";

import Text from "../../internal/Text";

import { Ids as StringIds } from "../../../resources/string";

/**
 * Container that has top time' label and value text.
 * It's set right end as a container's anchor.
 * Then, you should consider it in implementing that {@link StraightWins#position}.
 *
 * @class
 */
export class TopTime extends Container {
  private _label: Text;
  private _value: Text;

  constructor(topTime: number) {
    super();

    this._label = new Text(t(StringIds.LABEL_TOP_TIME), {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 20,
      // textBaseline: 'middle',
      padding: 5 // prevent to cut off words.
    });
    this._value = new Text(`${topTime}`, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 30,
      padding: 5 // prevent to cut off words.
    });

    // Set position to be set right end as anchor.
    const totalWidth = this._label.width + this._value.width;
    this._label.position.x = -1 * totalWidth + this._label.width * 0.5;
    this._value.position.x = -1 * this._value.width * 0.5;

    this.addChild(this._label, this._value);
  }
}

export default TopTime;
