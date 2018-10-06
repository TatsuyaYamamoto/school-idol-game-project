import State from "../state.js";
import Util from "../util.js";
import GameEngine from "./game-engine.js";

export default class HowToPlayEngine extends GameEngine {
  constructor(tick, callbackState) {
    super(tick, callbackState);
  }

  // @Override
  start() {
    super.allButtonDisable();
    this.handleLinkButtonEventListener().add();
    this.handleButtonEventListener().add();
    this.handleKeyDownEventListener().add();

    Util.addChildren([
      State.object.image.BACKGROUND,
      State.object.image.BUTTON_LEFT,
      State.object.image.BUTTON_RIGHT,
      State.object.image.BUTTON_TOP,
      State.object.image.BUTTON_BOTTOM,
      State.object.image.BUTTON_BACK_MENU_FROM_HOW,
      State.object.text.HOW_TO_PLAY,
      this.player.img
    ]);

    // HowToPlayアニメーション開始
    this.tick.add(() => {
      this.processHowToPlay();
    });
  }

  processHowToPlay() {
    if (this.gameFrame % 20 === 0) {
      this.player.changeDirection();
      this.player.wait();
      super.updateButtonStatus(this.player.getDirection());
    }

    this.gameFrame++;
    State.gameStage.update();
  }

  // @Override
  finish() {
    this.tick.remove();
    this.handleLinkButtonEventListener().remove();
    this.handleButtonEventListener().remove();
    this.handleKeyDownEventListener().remove();

    this.callbackState();
  }

  /*******************************
   * 画面遷移ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleLinkButtonEventListener() {
    const backMenu = () => {
      State.object.sound.BACK.play("none", 0, 0, 0, 1, 0);
      this.finish();
    };

    return {
      add: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_HOW.addEventListener(
          "mousedown",
          backMenu
        );
      },
      remove: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_HOW.removeAllEventListeners(
          "mousedown"
        );
      }
    };
  }
}
