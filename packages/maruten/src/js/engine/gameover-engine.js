import * as alertify from "alertify/lib/alertify";
import {
  openModal,
  tweetByWebIntent,
  Playlog,
  trackEvent,
  tracePage,
  createUrchinTrackingModuleQuery,
  convertYyyyMmDd
} from "@sokontokoro/mikan";

import State from "../state.js";
import Util from "../util.js";
import { CHARACTER, LINK } from "../static/constant.js";
import { TRACK_ACTION, TRACK_PAGES } from "../static/config";

export default class GameoverEngine {
  constructor(tick, callbackMenuState, callbackGameState) {
    this.tick = tick;
    this.callbackMenuState = callbackMenuState;
    this.callbackGameState = callbackGameState;

    this.handleLinkButtonEventListener().add();
  }

  start() {
    // プレイログ、ランキング登録
    const point = State.gameScore;
    const member = State.playCharacter;

    tracePage(TRACK_PAGES.GAMEOVER);

    trackEvent(TRACK_ACTION.GAMEOVER, { value: State.gameScore });

    Playlog.save("maruten", member, point).then(() => {
      if (State.loginUser.isAnonymous) {
        return;
      }
      alertify.log("ランキングシステム　通信完了！", "success", 3000);
    });

    // 表示スコア設定
    State.object.text.RESULT_SCORE.text = `×${State.gameScore}`;

    const targetChildren = [State.object.image.BACKGROUND];

    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        targetChildren.push(
          State.object.image.BUTTON_BACK_MENU_FROM_GAME,
          State.object.image.BUTTON_RESTART,
          State.object.image.GAMEOVER_IMAGE,
          State.object.image.BUTTON_TWITTER_GAMEOVER_HANAMARU,
          State.object.image.RESULT_COUNT_YOSHIKO
        );
        break;
      case CHARACTER.YOU:
        targetChildren.push(
          State.object.image.BUTTON_BACK_MENU_FROM_GAME_YOU,
          State.object.image.BUTTON_RESTART_YOU,
          State.object.image.GAMEOVER_IMAGE_YOU,
          State.object.image.BUTTON_TWITTER_GAMEOVER_YOU,
          State.object.image.RESULT_COUNT_RIKO
        );
        break;
    }
    targetChildren.push(
      State.object.text.RESULT_SCORE,
      State.object.image.GAMEOVER_TITLE
    );
    Util.addChildren(targetChildren);

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

      trackEvent(TRACK_ACTION.CLICK, { label: "back_from_gameover" });
    };
    const restart = () => {
      this.tick.remove();
      this.handleLinkButtonEventListener().remove();

      State.object.sound.BACK.stop();
      State.object.sound.BACK.play();

      this.callbackGameState();

      trackEvent(TRACK_ACTION.CLICK, { label: "restart" });
    };
    const tweet = () => {
      State.object.sound.OK.stop();
      State.object.sound.OK.play();

      trackEvent(TRACK_ACTION.CLICK, { label: "tweet" });

      openModal({
        text: "外部サイト(twitter.com)にアクセスします！",
        actions: [
          {
            text: "OK",
            onClick: () => {
              State.object.sound.OK.stop();
              State.object.sound.OK.play();

              const yyyymmdd = convertYyyyMmDd(new Date());
              const utmQuery = createUrchinTrackingModuleQuery({
                campaign: `result-share_${yyyymmdd}`,
                source: "twitter",
                medium: "social"
              });
              const url = `${LINK.GAME}?${utmQuery.join("&")}`;

              tweetByWebIntent({
                text: GameoverEngine.getTweetText(),
                url,
                hashtags: ["まるてん", "そこんところ工房"]
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
        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_BACK_MENU_FROM_GAME.addEventListener(
              "mousedown",
              goToMenue
            );
            State.object.image.BUTTON_RESTART.addEventListener(
              "mousedown",
              restart
            );
            State.object.image.BUTTON_TWITTER_GAMEOVER_HANAMARU.addEventListener(
              "mousedown",
              tweet
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_BACK_MENU_FROM_GAME_YOU.addEventListener(
              "mousedown",
              goToMenue
            );
            State.object.image.BUTTON_RESTART_YOU.addEventListener(
              "mousedown",
              restart
            );
            State.object.image.BUTTON_TWITTER_GAMEOVER_YOU.addEventListener(
              "mousedown",
              tweet
            );
            break;
        }
      },
      remove: () => {
        switch (State.playCharacter) {
          case CHARACTER.HANAMARU:
            State.object.image.BUTTON_BACK_MENU_FROM_GAME.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_RESTART.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_TWITTER_GAMEOVER_HANAMARU.removeAllEventListeners(
              "mousedown"
            );
            break;
          case CHARACTER.YOU:
            State.object.image.BUTTON_BACK_MENU_FROM_GAME_YOU.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_RESTART_YOU.removeAllEventListeners(
              "mousedown"
            );
            State.object.image.BUTTON_TWITTER_GAMEOVER_YOU.removeAllEventListeners(
              "mousedown"
            );
            break;
        }
      }
    };
  }

  /************************************
   * ツイート文言を返却する
   * @returns {string}
   */
  static getTweetText() {
    switch (State.playCharacter) {
      case CHARACTER.HANAMARU:
        if (State.gameScore == 0) {
          switch (Math.floor(Math.random() * 2)) {
            case 0:
              return `まる「いや、まるには無理ず、、、いや、むり、、。」`;
            case 1:
            default:
              return `まる「おらには無理ずら、、、、、。」`;
          }
        }

        switch (Math.floor(Math.random() * 4)) {
          case 0:
            return `まる「やーっぱり、よしこちゃんは${
              State.gameScore
            }ヨハネじゃないと！」`;
          case 1:
            return `まる「ずら！まるがお願い聞いたずら！危なくなったら止めてと！」${
              State.gameScore
            }ヨハネ！`;
          case 2:
            return `まる「さぁ！まるてん行くずらー！」 ${
              State.gameScore
            }ヨハネ！`;
          case 3:
          default:
            return `まる「まさか${
              State.gameScore
            }ヨハネも堕天するとは思わなかったずら」`;
        }
        break;

      case CHARACTER.YOU:
        if (State.gameScore == 0) {
          switch (Math.floor(Math.random() * 2)) {
            case 0:
              return `りこ「やっぱりなれないわ、本当にこんなに短くて大丈夫なの、、、」`;
            case 1:
            default:
              return `よう「一回も当てられないなんて、バカヨウだ、、、」`;
          }
        }

        switch (Math.floor(Math.random() * 4)) {
          case 0:
            return `よう「${
              State.gameScore
            }リリー！スクールアイドルだもんね！」`;
          case 1:
            return `よう「おっ、${
              State.gameScore
            }リリーなんて、なかなかのリコちゃんマニアだね？！」`;
          case 2:
            return `よう「堕天使だってタダじゃないんだから、リコちゃんもがんばルビィして！」 ${
              State.gameScore
            }リリー！`;
          case 3:
          default:
            return `よう「船も水泳も堕天使も、ユニフォームがあるところがいいんだよね。リコチャンもかわいくて最高♪」${
              State.gameScore
            }リリー！`;
        }
        break;

      default:
        return State.gameScore + "ヨハネ！";
    }
  }
}
