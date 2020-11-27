import { Texture } from "pixi.js";

import { t, loadTexture, loadFrames } from "@sokontokoro/mikan";

import { FrameStructureIndexes } from "./Character";
import Player from "./Player";
import PlayerCloseUp from "./PlayerCloseUp";

import { Ids } from "../../../resources/image";
import { Ids as StringIds } from "../../../resources/string";

const FRAMES: FrameStructureIndexes = {
  WAIT: [0, 1, 2],
  TRY_ATTACK: [4],
  SUCCESS_ATTACK: [3],
  LOSE: [5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5],
  WIN: [11, 12],
  LOSE_TEXTURE: 5,
  WIN_TEXTURE: 12,
};

/**
 * @class
 */
class HanamaruCloseUp extends PlayerCloseUp {
  public constructor() {
    super(loadTexture(Ids.CHARACTER_HANAMARU_CLOSEUP));
  }
}

/**
 * @class
 */
class Hanamaru extends Player {
  public constructor() {
    super(loadFrames(Ids.CHARACTER_HANAMARU), FRAMES, new HanamaruCloseUp());
  }

  public get name(): string {
    return t(StringIds[StringIds.CHARA_NAME_HANAMARU]);
  }
}

export default Hanamaru;
