import { loadTexture } from "@sokontokoro/mikan";
import Button from "../../internal/Button";

import { Ids } from "../../../resources/image";

class HomeButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_HOME));
  }
}

export default HomeButton;
