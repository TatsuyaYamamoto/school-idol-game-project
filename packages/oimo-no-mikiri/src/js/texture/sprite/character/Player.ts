import { Texture } from "pixi.js";

import Character, { FrameStructureIndexes } from "./Character";
import PlayerCloseUp from "./PlayerCloseUp";

abstract class Player extends Character {
  protected _closeUpTexture: PlayerCloseUp;

  protected constructor(
    frameTextures: Texture[],
    indexed: FrameStructureIndexes,
    closeUpTexture: PlayerCloseUp
  ) {
    super(frameTextures, indexed);
    this._closeUpTexture = closeUpTexture;
  }

  public get closeUpTexture(): PlayerCloseUp {
    return this._closeUpTexture;
  }
}

export default Player;
