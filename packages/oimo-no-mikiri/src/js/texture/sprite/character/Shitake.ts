// TODO
/* eslint-disable max-classes-per-file */
import { t, loadTexture, loadFrames } from "@sokontokoro/mikan";

import { FrameStructureIndexes } from "./Character";
import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import { Ids } from "../../../resources/image";
import { Ids as StringIds } from "../../../resources/string";

const FRAMES: FrameStructureIndexes = {
  WAIT: [0, 1],
  TRY_ATTACK: [2],
  SUCCESS_ATTACK: [3],
  LOSE: [4, 5],
  WIN: [6, 7],
  LOSE_TEXTURE: 4,
  WIN_TEXTURE: 6,
};

/**
 * @class
 */
class ShitakeCloseUp extends OpponentCloseUp {
  public constructor() {
    super(loadTexture(Ids.CHARACTER_SHITAKE_CLOSEUP));
  }
}

/**
 * @class
 */
class Shitake extends Opponent {
  readonly name = t(StringIds[StringIds.CHARA_NAME_SHITAKE]);

  public constructor() {
    super(loadFrames(Ids.CHARACTER_SHITAKE), FRAMES, new ShitakeCloseUp());
  }
}

export default Shitake;
