import { t, loadTexture, loadFrames } from "mikan";

import { FrameStructureIndexes } from "./Character";
import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import { Ids } from "../../../resources/image";
import { Ids as StringIds } from "../../../resources/string";

const FRAMES: FrameStructureIndexes = {
  WAIT: [0, 1, 2],
  TRY_ATTACK: [4],
  SUCCESS_ATTACK: [3],
  LOSE: [7, 8],
  WIN: [5, 6],
  LOSE_TEXTURE: 7,
  WIN_TEXTURE: 6
};

/**
 * @class
 */
class RubyCloseUp extends OpponentCloseUp {
  public constructor() {
    super(loadTexture(Ids.CHARACTER_RUBY_CLOSEUP));
  }
}

/**
 * @class
 */
class Ruby extends Opponent {
  public constructor() {
    super(loadFrames(Ids.CHARACTER_RUBY), FRAMES, new RubyCloseUp());
  }

  public get name(): string {
    return t(StringIds.CHARA_NAME_RUBY);
  }
}

export default Ruby;
