import Button from "../../internal/Button";

import { loadTexture } from "../../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class SelectCharacterButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_MENU_SELECT_CHARACTER));
  }
}

export default SelectCharacterButton;
