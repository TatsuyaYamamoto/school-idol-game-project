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
  WIN_TEXTURE: 6
};

/**
 * @class
 */
class WataameCloseUp extends OpponentCloseUp {
  public constructor() {
    super(loadTexture(Ids.CHARACTER_WATAAME_CLOSEUP));
  }
}

/**
 * @class
 */
class Wataame extends Opponent {
  public constructor() {
    super(loadFrames(Ids.CHARACTER_WATAAME), FRAMES, new WataameCloseUp());
  }

  public get name(): string {
    return t(StringIds.CHARA_NAME_WATAAME);
  }
}

export default Wataame;
