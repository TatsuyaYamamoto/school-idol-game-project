import Sprite from "../internal/Sprite";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../resources/image";

/**
 * @class
 */
class GameOverLogo extends Sprite {
  public constructor() {
    super(loadTexture(Ids.LOGO_GAME_OVER));
  }
}

export default GameOverLogo;
