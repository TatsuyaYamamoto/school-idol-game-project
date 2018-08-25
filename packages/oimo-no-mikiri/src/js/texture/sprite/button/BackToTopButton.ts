import Button from "../../internal/Button";

import { loadTexture } from "../../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class BackToTopButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GAMEOVER_BACK_TO_TOP));
  }
}

export default BackToTopButton;
