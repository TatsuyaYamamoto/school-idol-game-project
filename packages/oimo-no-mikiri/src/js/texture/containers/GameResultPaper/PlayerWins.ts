import { Container } from "pixi.js";

import { t } from "@sokontokoro/mikan";

import Text from "../../internal/Text";

import { Ids as StringIds } from "../../../resources/string";

class PlayerWins extends Container {
  readonly _playerNumberLabel: Text;

  readonly _winsLabel: Text;

  readonly _winsValue: Text;

  constructor(playerNumber: number, wins: number) {
    super();

    this._playerNumberLabel = new Text(`${playerNumber}P`, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 40,
      padding: 5, // prevent to cut off words.
    });

    this._winsLabel = new Text(t(StringIds[StringIds.LABEL_WINS]), {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 30,
      padding: 5, // prevent to cut off words.
    });

    this._winsValue = new Text(`${wins}`, {
      fontFamily: "g_brushtappitsu_freeH",
      fontSize: 60,
      padding: 5, // prevent to cut off words.
    });

    this._playerNumberLabel.position.set(
      (-1 * this._playerNumberLabel.width) / 2,
      (-1 * this._playerNumberLabel.height) / 2
    );
    this._winsLabel.position.set(
      this._winsLabel.width / 2,
      (-1 * this._winsLabel.height) / 2
    );
    this._winsValue.position.set(
      this._winsValue.width / 2,
      this._winsValue.height / 2
    );

    this.addChild(this._playerNumberLabel, this._winsLabel, this._winsValue);
  }
}

export default PlayerWins;
