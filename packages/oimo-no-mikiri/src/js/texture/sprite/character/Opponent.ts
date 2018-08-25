import { Texture } from "pixi.js";

import Character, { FrameStructureIndexes } from "./Character";
import OpponentCloseUp from "./OpponentCloseUp";

abstract class Opponent extends Character {
  private _closeUpTexture: OpponentCloseUp;

  constructor(
    frameTextures: Texture[],
    indexed: FrameStructureIndexes,
    closeUpTexture: OpponentCloseUp
  ) {
    super(frameTextures, indexed);
    this._closeUpTexture = closeUpTexture;
  }

  public get closeUpTexture(): OpponentCloseUp {
    return this._closeUpTexture;
  }
}

export default Opponent;
