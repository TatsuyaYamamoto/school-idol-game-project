import State from "../state.js";
import Util from "../util.js";
import { LINK } from "../static/constant.js";
import { openExternalSite, openModal, t } from "@sokontokoro/mikan";

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
      CreditEngine.showLinkDialog(
        LINK.SOUNDEFFECT_HOME,
        "soundeffect-lab.info"
      );
    };

    const goToOnJin = () => {
      CreditEngine.showLinkDialog(LINK.ONJIN_HOME, "on-jin.com");
    };

    const goToSokontokoro = () => {
      CreditEngine.showLinkDialog(LINK.T28_TWITTER, "twitter.com");
    };

    const goToSanzashi = () => {
      CreditEngine.showLinkDialog(LINK.SANZASHI_TWITTER, "twitter.com");
    };

    const goToLivelive = () => {
      CreditEngine.showLinkDialog(LINK.LOVELIVE, "lovelive-anime.jp");
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
        State.object.text.LINK_LOVELIVE.addEventListener(
          "mousedown",
          goToLivelive
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
        State.object.text.LINK_LOVELIVE.removeAllEventListeners("mousedown");
      }
    };
  }
  static showLinkDialog(url, displayDomain) {
    State.object.sound.OK.stop();
    State.object.sound.OK.play();

    openModal({
      text: `外部サイト(${displayDomain})にアクセスします！`,
      actions: [
        {
          text: "OK",
          onClick: () => {
            State.object.sound.OK.stop();
            State.object.sound.OK.play();

            openExternalSite(url);
          }
        },
        {
          text: "CANCEL",
          type: "cancel",
          onClick: () => {
            State.object.sound.BACK.stop();
            State.object.sound.BACK.play();
          }
        }
      ]
    });
  }
}
