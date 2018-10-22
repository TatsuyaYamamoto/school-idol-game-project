import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GoHowToPlayButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_HOW_TO_PLAY));
  }
}

export default GoHowToPlayButton;
