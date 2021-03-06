import {
  openModal,
  openExternalSite,
  signInAsTwitterUser,
  signOut,
  trackEvent,
  tracePage,
} from "@sokontokoro/mikan";

import State from "../state.js";
import Util from "../util.js";
import { LINK, CHARACTER } from "../static/constant.js";
import { TRACK_ACTION, TRACK_PAGES } from "../static/config.js";

export default class MenuEngine {
  constructor(stateMachine) {
    this.tick = stateMachine.tick;
    this.callbackGameState = stateMachine.gameState;
    this.callbackHowToPlayState = stateMachine.howToPlayState;
    this.callbackCreditState = stateMachine.creditState;
    this.callbackTopState = stateMachine.topState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    tracePage(TRACK_PAGES.MENU);

    const targetChildren = [State.object.image.BACKGROUND];
    if (!State.loginUser.isAnonymous) {
      targetChildren.push(
        State.object.image.BUTTON_TWITTER_LOGOUT,
        State.object.image.TWITTER_ICON
      );
    } else {
      targetChildren.push(State.object.image.BUTTON_TWITTER_LOGIN);
    }

    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        targetChildren.push(
          State.object.image.MENU_LOGO,
          State.object.image.BUTTON_START,
          State.object.image.BUTTON_HOW
        );
        break;
      case CHARACTER.YOU:
        targetChildren.push(
          State.object.image.MENU_LOGO_YOU,
          State.object.image.BUTTON_START_YOU,
          State.object.image.BUTTON_HOW_YOU
        );
        break;
    }

    targetChildren.push(
      State.object.image.BUTTON_RANKING,
      State.object.image.BUTTON_CREDIT,
      State.object.image.BUTTON_TWITTER_TOP,
      State.object.spritesheet.BUTTON_SOUND_SPRITESHEET
    );

    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        targetChildren.push(State.object.image.BUTTON_CHANGE_CHARA_RIKO);
        break;
      case CHARACTER.YOU:
        targetChildren.push(State.object.image.BUTTON_CHANGE_CHARA_YOSHIKO);
        break;
    }

    Util.addChildren(targetChildren);

    if (State.object.sound.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
      State.object.sound.ZENKAI.play({ loop: -1, volume: 0.4 });
    }

    this.tick.add(() => {
      State.gameStage.update();
    });
  }

  /*******************************
   * 画面遷移ボタンイベント
   * @returns {{add: add, remove: remove}}
   */
  handleLinkButtonEventListener() {
    const goToGame = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.ZENKAI.stop();

      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      this.callbackGameState();
    };

    const goToHowToPlay = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      this.callbackHowToPlayState();
    };

    const goToCredit = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      this.callbackCreditState();
    };

    const goToTwitterHome = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      trackEvent(TRACK_ACTION.CLICK, { label: "home" });

      openModal({
        text: "ホームページを開きます！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.OK.play();

              openExternalSite(LINK.SOKONTOKORO_HOME, false);
            },
          },
          {
            text: "CANCEL",
            type: "cancel",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.BACK.play();
            },
          },
        ],
      });
    };

    const goToRanking = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      trackEvent(TRACK_ACTION.CLICK, { label: "ranking" });

      openModal({
        text: "ランキングページを開きます！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.OK.stop();
              State.object.sound.OK.play();

              openExternalSite(LINK.RANKING, false);
            },
          },
          {
            text: "CANCEL",
            type: "cancel",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.BACK.play();
            },
          },
        ],
      });
    };

    const turnSoundSwitch = () => {
      State.object.sound.TURN_SWITCH.stop();
      State.object.sound.TURN_SWITCH.play();

      if (State.isSoundMute) {
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.gotoAndPlay("on");
        Util.soundTurnOn();

        trackEvent(TRACK_ACTION.CLICK, { label: "sound_on" });
      } else {
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.gotoAndPlay("off");
        Util.soundTurnOff();

        trackEvent(TRACK_ACTION.CLICK, { label: "sound_off" });
      }
    };

    const login = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      signInAsTwitterUser();

      trackEvent(TRACK_ACTION.CLICK, { label: "login" });
    };

    const logout = () => {
      State.object.sound.OK.play();
      State.object.sound.OK.stop();

      signOut().then(() => {
        location.reload();
      });

      trackEvent(TRACK_ACTION.CLICK, { label: "logout" });
    };

    const changeCharaAndRstart = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      switch (State.playCharacter) {
        case CHARACTER.HANAMARU:
          State.playCharacter = CHARACTER.YOU;
          break;
        case CHARACTER.YOU:
          State.playCharacter = CHARACTER.HANAMARU;
          break;
      }

      trackEvent(TRACK_ACTION.SELECT_CHARA, { label: State.playCharacter });

      this.callbackTopState();
    };

    return {
      add: () => {
        State.object.image.BUTTON_CREDIT.addEventListener(
          "mousedown",
          goToCredit
        );
        State.object.image.BUTTON_TWITTER_LOGIN.addEventListener(
          "mousedown",
          login
        );
        State.object.image.BUTTON_TWITTER_LOGOUT.addEventListener(
          "mousedown",
          logout
        );
        State.object.image.BUTTON_TWITTER_TOP.addEventListener(
          "mousedown",
          goToTwitterHome
        );
        State.object.image.BUTTON_RANKING.addEventListener(
          "mousedown",
          goToRanking
        );
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.addEventListener(
          "mousedown",
          turnSoundSwitch
        );

        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_START.addEventListener(
              "mousedown",
              goToGame
            );
            State.object.image.BUTTON_HOW.addEventListener(
              "mousedown",
              goToHowToPlay
            );
            State.object.image.BUTTON_CHANGE_CHARA_RIKO.addEventListener(
              "mousedown",
              changeCharaAndRstart
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_START_YOU.addEventListener(
              "mousedown",
              goToGame
            );
            State.object.image.BUTTON_HOW_YOU.addEventListener(
              "mousedown",
              goToHowToPlay
            );
            State.object.image.BUTTON_CHANGE_CHARA_YOSHIKO.addEventListener(
              "mousedown",
              changeCharaAndRstart
            );
            break;
        }
      },
      remove: () => {
        State.object.image.BUTTON_CREDIT.removeAllEventListeners("mousedown");
        State.object.image.BUTTON_TWITTER_LOGIN.removeAllEventListeners(
          "mousedown"
        );
        State.object.image.BUTTON_TWITTER_LOGOUT.removeAllEventListeners(
          "mousedown"
        );
        State.object.image.BUTTON_TWITTER_TOP.removeAllEventListeners(
          "mousedown"
        );
        State.object.image.BUTTON_RANKING.removeAllEventListeners("mousedown");
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.removeAllEventListeners(
          "mousedown"
        );

        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_START.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_HOW.removeAllEventListeners("mousedown");
            State.object.image.BUTTON_CHANGE_CHARA_RIKO.removeAllEventListeners(
              "mousedown"
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_START_YOU.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_HOW_YOU.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_CHANGE_CHARA_YOSHIKO.removeAllEventListeners(
              "mousedown"
            );
            break;
        }
      },
    };
  }
}
