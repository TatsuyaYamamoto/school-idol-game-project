import { Sprite, Container } from "pixi.js";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

/**
 * @class
 */
class GameOverLogo extends Container {
  public constructor() {
    super();

    const gameOverLogo = new Sprite(loadTexture(Ids.LOGO_GAMEOVER));
    gameOverLogo.anchor.set(0.5);
    gameOverLogo.y = gameOverLogo.height * 1.6;

    const gameOverImage = new Sprite(loadTexture(Ids.LOGO_GAMEOVER_IMAGE));
    gameOverImage.anchor.set(0.5);

    this.addChild(gameOverImage, gameOverLogo);
  }
}

export default GameOverLogo;
