import Sprite from "../internal/Sprite";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../resources/image";

/**
 * @class
 */
class TitleLogo extends Sprite {
  public constructor() {
    super(loadTexture(Ids.LOGO_TITLE));
  }
}

export default TitleLogo;
