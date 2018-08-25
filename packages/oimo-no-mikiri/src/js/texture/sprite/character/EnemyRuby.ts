import { t } from "../../../../framework/i18n";
import { loadTexture, loadFrames } from "../../../../framework/AssetLoader";

import { FrameStructureIndexes } from "./Character";
import Opponent from "./Opponent";
import OpponentCloseUp from "./OpponentCloseUp";

import { Ids } from "../../../resources/image";
import { Ids as StringIds } from "../../../resources/string";

const FRAMES: FrameStructureIndexes = {
  WAIT: [0, 1, 2],
  TRY_ATTACK: [4],
  SUCCESS_ATTACK: [3],
  LOSE: [8, 9],
  WIN: [5, 6, 7],
  LOSE_TEXTURE: 8,
  WIN_TEXTURE: 5
};

/**
 * @class
 */
class EnemyRubyCloseUp extends OpponentCloseUp {
  public constructor() {
    super(loadTexture(Ids.CHARACTER_ENEMY_RUBY_CLOSEUP));
  }
}

/**
 * @class
 */
class EnemyRuby extends Opponent {
  public constructor() {
    super(loadFrames(Ids.CHARACTER_ENEMY_RUBY), FRAMES, new EnemyRubyCloseUp());
  }

  public get name(): string {
    return t(StringIds.CHARA_NAME_ENEMY_RUBY);
  }
}

export default EnemyRuby;
