import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GameRestartButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GAME_RESTART));
  }
}

export default GameRestartButton;
