import State from "../state.js";
import Util from "../util.js";
import { LINK } from "../static/constant.js";

export default class CreditEngine {
  constructor(callbackMenuGameState) {
    this.callbackMenuGameState = callbackMenuGameState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    Util.addChildren([
      State.object.image.BACKGROUND,
      State.object.image.BUTTON_BACK_MENU_FROM_CREDIT,
      State.object.text.LINK_SOKONTOKORO,
      State.object.text.LINK_SANZASHI,
      State.object.text.LINK_LOVELIVE,
      State.object.text.LINK_SOUNDEFFECT,
      State.object.text.LINK_ONJIN
    ]);
    State.gameStage.update();
  }

  /*******************************
   * 画面遷移ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleLinkButtonEventListener() {
    const goToMenu = () => {
      this.handleLinkButtonEventListener().remove();
      State.object.sound.BACK.stop();
      State.object.sound.BACK.play();

      this.callbackMenuGameState();
    };

    const goToSoundeffect = () => {
      window.location.href = LINK.SOUNDEFFECT_HOME;
    };

    const goToOnJin = () => {
      window.location.href = LINK.ONJIN_HOME;
    };

    const goToSokontokoro = () => {
      window.location.href = LINK.SOKONTOKORO_HOME;
    };

    const goToSanzashi = () => {
      window.location.href = LINK.SANZASHI_TWITTER;
    };

    return {
      add: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_CREDIT.addEventListener(
          "mousedown",
          goToMenu
        );
        State.object.text.LINK_SOUNDEFFECT.addEventListener(
          "mousedown",
          goToSoundeffect
        );
        State.object.text.LINK_ONJIN.addEventListener("mousedown", goToOnJin);
        State.object.text.LINK_SOKONTOKORO.addEventListener(
          "mousedown",
          goToSokontokoro
        );
        State.object.text.LINK_SANZASHI.addEventListener(
          "mousedown",
          goToSanzashi
        );
      },
      remove: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_CREDIT.removeAllEventListeners(
          "mousedown"
        );
        State.object.text.LINK_SOUNDEFFECT.removeAllEventListeners("mousedown");
        State.object.text.LINK_ONJIN.removeAllEventListeners("mousedown");
        State.object.text.LINK_SOKONTOKORO.removeAllEventListeners("mousedown");
        State.object.text.LINK_SANZASHI.removeAllEventListeners("mousedown");
      }
    };
  }
}
