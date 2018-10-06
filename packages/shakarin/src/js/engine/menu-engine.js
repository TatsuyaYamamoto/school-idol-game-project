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
    if (State.isLogin) {
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

    if (State.object.sound.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
      State.object.sound.ZENKAI.play("none", 0, 0, -1, 0.4, 0);
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
      State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
      this.callbackGameState();
    };

    const goToHowToPlay = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
      this.callbackHowToPlayState();
    };

    const goToCredit = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
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
      State.object.sound.TURN_SWITCH.play("none", 0, 0, 0, 1, 0);
      if (State.isSoundMute) {
        State.object.ss.BUTTON_SOUND_SS.gotoAndPlay("on");
        Util.soundTurnOn();
      } else {
        State.object.ss.BUTTON_SOUND_SS.gotoAndPlay("off");
        Util.soundTurnOff();
      }
    };

    const login = () => {
      State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
      alertify.confirm("ランキングシステムにログインします！", result => {
        if (result) {
          State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
          window.location.href = config.api.login;
        } else {
          State.object.sound.BACK.play("none", 0, 0, 0, 1, 0);
        }
      });
    };

    const logout = () => {
      State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
      alertify.confirm(
        "ログアウトします。ランキング登録はログイン中のみ有効です。",
        result => {
          if (result) {
            State.object.sound.OK.play("none", 0, 0, 0, 1, 0);
            window.location.href = config.api.logout + "?redirect=shakarin";
          } else {
            State.object.sound.BACK.play("none", 0, 0, 0, 1, 0);
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
