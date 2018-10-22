import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GoBackHomeButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_BACK_HOME));
  }
}

export default GoBackHomeButton;
