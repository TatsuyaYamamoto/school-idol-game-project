import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GoRankingButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_RANKING));
  }
}

export default GoRankingButton;
