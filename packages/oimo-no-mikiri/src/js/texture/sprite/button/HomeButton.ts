import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class HomeButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_HOME));
  }
}

export default HomeButton;
