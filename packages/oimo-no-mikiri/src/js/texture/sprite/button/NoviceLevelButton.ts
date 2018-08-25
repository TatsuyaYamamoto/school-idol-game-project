import Button from "../../internal/Button";

import { loadTexture } from "../../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class NoviceLevelButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_LEVEL_NOVICE));
  }
}

export default NoviceLevelButton;
