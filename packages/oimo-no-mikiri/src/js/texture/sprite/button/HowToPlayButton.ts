import Button from "../../internal/Button";

import { loadTexture } from "mikan";

import { Ids } from "../../../resources/image";

class HowToPlayButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_MENU_HOW_TO_PLAY));
  }
}

export default HowToPlayButton;
