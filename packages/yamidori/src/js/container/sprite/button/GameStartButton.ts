import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GameStartButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GAME_START));
  }
}

export default GameStartButton;
