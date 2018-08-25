import Button from "../../internal/Button";

import { loadTexture } from "../../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class ExpertLevelButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_LEVEL_EXPERT));
  }
}

export default ExpertLevelButton;
