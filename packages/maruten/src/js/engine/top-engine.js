import State from "../state.js";
import Util from "../util.js";
import properties from "../static/properties.js";
import { CHARACTER } from "../static/constant.js";

export default class TopEngine {
  constructor(callbackMenuGameState) {
    this.callbackMenuGameState = callbackMenuGameState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    Util.addChildren([
      State.object.image.BACKGROUND,
      TopEngine.getTitleLogChild(),
      State.object.text.START
    ]);
    State.gameStage.update();

    if (State.object.sound.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
      State.object.sound.ZENKAI.play({ loop: -1, volume: 0.4 });
    }
  }

  static getTitleLogChild() {
    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        return State.gameStage.addChild(State.object.image.TITLE_LOGO_HANAMARU);
      case CHARACTER.YOU:
        return State.gameStage.addChild(State.object.image.TITLE_LOGO_YOU);
    }
  }

  /*******************************
   * 画面遷移ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleLinkButtonEventListener() {
    const goToMenu = () => {
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      this.callbackMenuGameState();
    };

    return {
      add: () => {
        State.object.image.BACKGROUND.addEventListener("mousedown", goToMenu);
      },
      remove: () => {
        State.object.image.BACKGROUND.removeAllEventListeners("mousedown");
      }
    };
  }
}
