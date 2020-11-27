import { Container } from "pixi.js";

import { t } from "@sokontokoro/mikan";

import Text from "../../internal/Text";

import { Ids as StringIds } from "../../../resources/string";

const winsLabelStyle = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 35,
};

const winsStyle = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 60,
};

const battleLeftLabelStyle = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 35,
};

const battleLeftStyle = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 60,
};

class BattleStatusBoard extends Container {
  readonly _onePlayerWinsLabel: Text;

  readonly _onePlayerWins: Text;

  readonly _twoPlayerWinsLabel: Text;

  readonly _twoPlayerWins: Text;

  readonly _battleLeftLabel: Text;

  readonly _battleLeft: Text;

  constructor(width: number, height: number) {
    super();

    this._onePlayerWinsLabel = new Text(
      t(StringIds[StringIds.LABEL_WINS]),
      winsLabelStyle
    );
    this._onePlayerWinsLabel.position.set(-1 * width * 0.3, -1 * height * 0.05);

    this._onePlayerWins = new Text("0?", winsStyle);
    this._onePlayerWins.position.set(-1 * width * 0.3, height * 0.05);

    this._twoPlayerWinsLabel = new Text(
      t(StringIds[StringIds.LABEL_WINS]),
      winsLabelStyle
    );
    this._twoPlayerWinsLabel.position.set(width * 0.3, -1 * height * 0.05);

    this._twoPlayerWins = new Text("0?", winsStyle);
    this._twoPlayerWins.position.set(width * 0.3, height * 0.05);

    this._battleLeftLabel = new Text(
      t(StringIds[StringIds.LABEL_BATTLE_LEFT]),
      battleLeftLabelStyle
    );
    this._battleLeftLabel.position.set(0, -1 * height * 0.05);

    this._battleLeft = new Text("0", battleLeftStyle);
    this._battleLeft.position.set(0, height * 0.05);

    this.addChild(
      this._onePlayerWinsLabel,
      this._onePlayerWins,
      this._twoPlayerWinsLabel,
      this._twoPlayerWins,
      this._battleLeftLabel,
      this._battleLeft
    );
  }

  set onePlayerWins(wins: number) {
    if (!Number.isInteger(wins)) {
      throw new Error(`Wins should be integer. Provided value is ${wins}`);
    }

    this._onePlayerWins.text = `${wins}`;
  }

  set twoPlayerWins(wins: number) {
    if (!Number.isInteger(wins)) {
      throw new Error(`Wins should be integer. Provided value is ${wins}`);
    }

    this._twoPlayerWins.text = `${wins}`;
  }

  set battleLeft(battleLeft: number) {
    if (!Number.isInteger(battleLeft)) {
      throw new Error(
        `BattleLeft should be integer. Provided value is ${battleLeft}`
      );
    }

    this._battleLeft.text = `${battleLeft}`;
  }
}

export default BattleStatusBoard;
