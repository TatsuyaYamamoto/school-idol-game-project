import { openModal, Playlog, tweetByWebIntent } from "@sokontokoro/mikan";
import * as alertify from "alertify/lib/alertify";

import State from "../state.js";
import Util from "../util.js";

export default class GameoverEngine {
  constructor(tick, player, callbackMenuState, callbackGameState) {
    this.tick = tick;
    this.player = player;
    this.callbackMenuState = callbackMenuState;
    this.callbackGameState = callbackGameState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    Playlog.save("shakarin", "rin", State.gameScore).then(() => {
      if (!State.loginUser.isAnonymous) {
        alertify.log("ランキングシステム　通信完了！", "success", 3000);
      }
    });

    // フィニッシュアニメーション
    this.player.finish();

    Util.addChildren([
      State.object.image.BACKGROUND,
      this.player.img,
      State.object.image.BUTTON_BACK_MENU_FROM_GAME,
      State.object.image.BUTTON_RESTART,
      State.object.text.SCORE_COUNT,
      State.object.image.GAMEOVER
    ]);
    switch (State.playCharacter) {
      case "rin":
        State.gameStage.addChild(
          State.object.image.BUTTON_TWITTER_GAMEOVER_RIN
        );
        break;
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
    const goToMenue = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.BACK.stop();
      State.object.sound.BACK.play();

      this.callbackMenuState();
    };
    const restart = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.BACK.stop();
      State.object.sound.BACK.play();

      this.callbackGameState();
    };
    const tweet = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      openModal({
        text: "外部サイト(twitter.com)にアクセスします！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.OK.stop();
              State.object.sound.OK.play();

              tweetByWebIntent({
                text: this.getTweetText(),
                url: "https://games.sokontokoro-factory.net/shakarin/",
                hashtags: ["しゃかりん", "そこんところ工房"]
              });
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

    return {
      add: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_GAME.addEventListener(
          "mousedown",
          goToMenue
        );
        State.object.image.BUTTON_RESTART.addEventListener(
          "mousedown",
          restart
        );
        State.object.image.BUTTON_TWITTER_GAMEOVER_RIN.addEventListener(
          "mousedown",
          tweet
        );
      },
      remove: () => {
        State.object.image.BUTTON_BACK_MENU_FROM_GAME.removeEventListener(
          "mousedown",
          goToMenue
        );
        State.object.image.BUTTON_RESTART.removeEventListener(
          "mousedown",
          restart
        );
        State.object.image.BUTTON_TWITTER_GAMEOVER_RIN.removeEventListener(
          "mousedown",
          tweet
        );
      }
    };
  }

  /************************************
   * ツイート文言を返却する
   * @returns {string}
   */
  getTweetText() {
    switch (State.playCharacter) {
      case "rin":
        if (State.gameScore == 0) {
          return `凛「ちょっと寒くないかにゃー？」`;
        }

        switch (Math.floor(Math.random() * 4)) {
          case 0:
            return `凛「ちいさなマラカス♪しゃかしゃか${
              State.gameScore
            }しゃかー！」`;
          case 1:
            return `凛「それより今日こそ先輩のところに行って"しゃかりんやります！"って言わなきゃ！」${
              State.gameScore
            }しゃか！`;
          case 2:
            return `凛「待って！しゃかしゃかするなら凛が！凛が！ 凛が${
              State.gameScore
            }しゃかするの！！」`;
          case 3:
            return `エリチカ？「${State.gameScore}しゃかァ？認められないわァ」`;
        }
    }
    return State.gameScore + "しゃか！";
  }
}
