import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class ChangeLanguageButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_CHANGE_LANGUAGE));
  }
}

export default ChangeLanguageButton;
