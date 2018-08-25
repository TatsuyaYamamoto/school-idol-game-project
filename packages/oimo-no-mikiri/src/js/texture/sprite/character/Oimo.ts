import AnimatedSprite from "../../internal/AnimatedSprite";
import { Ids } from "../../../resources/image";
import { loadFrames } from "../../../../framework/AssetLoader";

const ANIMATION_SPEED = 0.05;

class Oimo extends AnimatedSprite {
  constructor() {
    super(loadFrames(Ids.CHARACTER_OIMO));

    this.animationSpeed = ANIMATION_SPEED;
  }
}

export default Oimo;
