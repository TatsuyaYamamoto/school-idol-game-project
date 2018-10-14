import { signInAsTwitterUser, signOut } from "@sokontokoro/mikan";
import * as alertify from "alertify/lib/alertify";

import State from "../state.js";
import Util from "../util.js";
import { config } from "../config.js";

export default class MenuEngine {
  constructor(
    tick,
    callbackGameState,
    callbackHowToPlayState,
    callbackCreditState
  ) {
    this.tick = tick;
    this.callbackGameState = callbackGameState;
    this.callbackHowToPlayState = callbackHowToPlayState;
    this.callbackCreditState = callbackCreditState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    let targetChildren = [State.object.image.BACKGROUND];

    if (!State.loginUser.isAnonymous) {
      targetChildren.push(
        State.object.image.BUTTON_TWITTER_LOGOUT,
        State.object.image.TWITTER_ICON
      );
    } else {
      targetChildren.push(State.object.image.BUTTON_TWITTER_LOGIN);
    }

    targetChildren.push(
      State.object.image.BUTTON_START,
      State.object.image.BUTTON_HOW,
      State.object.image.BUTTON_RANKING,
      State.object.image.BUTTON_CREDIT,
      State.object.image.BUTTON_TWITTER_TOP,
      State.object.ss.BUTTON_SOUND_SS,
      State.object.image.MENU_LOGO
    );

    Util.addChildren(targetChildren);

    if (State.object.sound.ZENKAI.playState !== createjs.Sound.PLAY_SUCCEEDED) {
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
      window.location.href = config.link.t28_twitter;
    };

    const goToRanking = () => {
      window.location.href =
        "http://games.sokontokoro-factory.net/ranking/?game=shakarin";
    };

    const turnSoundSwitch = () => {
      State.object.sound.TURN_SWITCH.stop();
      State.object.sound.TURN_SWITCH.play();

      if (State.isSoundMute) {
        State.object.ss.BUTTON_SOUND_SS.gotoAndPlay("on");
        Util.soundTurnOn();
      } else {
        State.object.ss.BUTTON_SOUND_SS.gotoAndPlay("off");
        Util.soundTurnOff();
      }
    };

    const login = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      alertify.confirm("ランキングシステムにログインします！", result => {
        if (result) {
          State.object.sound.OK.stop();
          State.object.sound.OK.play();

          signInAsTwitterUser();
        } else {
          State.object.sound.BACK.stop();
          State.object.sound.BACK.play();
        }
      });
    };

    const logout = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      alertify.confirm(
        "ログアウトします。ランキング登録はログイン中のみ有効です。",
        result => {
          if (result) {
            State.object.sound.OK.stop();
            State.object.sound.OK.play();

            signOut().then(() => {
              location.reload();
            });
          } else {
            State.object.sound.BACK.stop();
            State.object.sound.BACK.play();
          }
        }
      );
    };

    return {
      add: () => {
        State.object.image.BUTTON_START.addEventListener("mousedown", goToGame);
        State.object.image.BUTTON_HOW.addEventListener(
          "mousedown",
          goToHowToPlay
        );
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
        State.object.ss.BUTTON_SOUND_SS.addEventListener(
          "mousedown",
          turnSoundSwitch
        );
      },
      remove: () => {
        State.object.image.BUTTON_START.removeAllEventListeners("mousedown");
        State.object.image.BUTTON_HOW.removeAllEventListeners("mousedown");
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
        State.object.ss.BUTTON_SOUND_SS.removeAllEventListeners("mousedown");
      }
    };
  }
}
