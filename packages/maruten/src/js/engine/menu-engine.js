import { openModal, openExternalSite } from "@sokontokoro/mikan";

import State from "../state.js";
import Util from "../util.js";
import { ENDPOINT, LINK, CHARACTER } from "../static/constant.js";

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
    const targetChildren = [State.object.image.BACKGROUND];
    if (State.isLogin) {
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

      openModal({
        text: "ホームページににアクセスします！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.OK.play();

              openExternalSite(LINK.SOKONTOKORO_HOME);
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
    };

    const goToRanking = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      openModal({
        text: "ランキングページにアクセスします！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.OK.play();

              openExternalSite(LINK.RANKING);
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
    };

    const turnSoundSwitch = () => {
      State.object.sound.TURN_SWITCH.stop();
      State.object.sound.TURN_SWITCH.play();

      if (State.isSoundMute) {
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.gotoAndPlay("on");
        Util.soundTurnOn();
      } else {
        State.object.spritesheet.BUTTON_SOUND_SPRITESHEET.gotoAndPlay("off");
        Util.soundTurnOff();
      }
    };

    const login = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      openModal({
        text: "ランキングシステムにログインします！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.BACK.stop();
              State.object.sound.OK.play();

              window.location.href = ENDPOINT.LOGIN;
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
    };

    const logout = () => {
      State.object.sound.OK.play();
      State.object.sound.OK.stop();

      openModal({
        text: "ログアウトします。ランキング登録はログイン中のみ有効です。",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.OK.stop();
              State.object.sound.OK.play();

              window.location.href = ENDPOINT.LOGOUT;
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
      }
    };
  }
}
