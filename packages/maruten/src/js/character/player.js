import State from "../state.js";
import { CHARACTER } from "../static/constant.js";

/**
 * ずら丸、ようちゃんクラス
 */
export default class Player {
  constructor() {
    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        this.img = State.object.spritesheet.HANAMARU;
        break;
      case CHARACTER.YOU:
        this.img = State.object.spritesheet.YOU;
        break;
    }

    this.img.gotoAndPlay("wait");
  }

  wait() {
    this.img.gotoAndPlay("wait");
  }

  prepareThrow() {
    this.img.gotoAndPlay("prepareThrow");
  }

  throw() {
    this.img.gotoAndPlay("throw");
  }
}
