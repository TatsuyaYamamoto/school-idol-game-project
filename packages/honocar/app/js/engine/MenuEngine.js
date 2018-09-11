import * as alertify from "alertify/lib/alertify";
import {
  copyTextToClipboard,
  getCurrentUrl,
  openModal,
  P2PClient
} from "@sokontokoro/mikan";

import globals from "../globals";
import Engine from "./Engine";
import { soundTurnOff, soundTurnOn } from "../contentsLoader";
import config from "../resources/config";
import CreditEngine from "./CreditEngine";
import HowToPlayEngine from "./HowToPlayEngine";
import TopEngine from "./TopEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import SelectCharaEngine from "./SelectCharaEngine";

class MenuEngine extends Engine {
  init() {
    super.init();

    const { playCharacter, gameStage, imageObj, ssObj, soundObj } = globals;

    gameStage.removeAllChildren();
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.WHITE_SHEET);
    gameStage.addChild(imageObj.MENU_BACKGROUND);

    if (globals.isLogin) {
      gameStage.addChild(imageObj.BUTTON_TWITTER_LOGOUT);
      gameStage.addChild(imageObj.TWITTER_ICON);
    } else {
      gameStage.addChild(imageObj.BUTTON_TWITTER_LOGIN);
    }

    gameStage.addChild(imageObj.BUTTON_START);
    gameStage.addChild(imageObj.BUTTON_START_ONLINE);
    gameStage.addChild(imageObj.BUTTON_HOW_TO);
    gameStage.addChild(imageObj.BUTTON_SELECT_CHARA);
    gameStage.addChild(imageObj.BUTTON_RANKING);
    gameStage.addChild(imageObj.BUTTON_CREDIT);
    gameStage.addChild(imageObj.BUTTON_TWITTER_TOP);
    gameStage.addChild(ssObj.BUTTON_SOUND_SS);

    if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
      soundObj.SOUND_ZENKAI.play({ loop: -1, volume: 0.4 });
    }

    createjs.Ticker.addEventListener("tick", this.progress);

    imageObj.BUTTON_START.addEventListener("mousedown", onClick2SinglePlay);
    imageObj.BUTTON_START_ONLINE.addEventListener(
      "mousedown",
      onClick2MultiPlay
    );
    imageObj.BUTTON_HOW_TO.addEventListener("mousedown", onClick2HowToPlay);
    imageObj.BUTTON_SELECT_CHARA.addEventListener(
      "mousedown",
      onClick2ChangeChara
    );
    imageObj.BUTTON_RANKING.addEventListener("mousedown", onClick2Ranking);
    imageObj.BUTTON_CREDIT.addEventListener("mousedown", onClick2Credit);
    imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", onClickLogin);
    imageObj.BUTTON_TWITTER_LOGOUT.addEventListener("mousedown", onClickLogout);
    imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", onClickTwitter);
    ssObj.BUTTON_SOUND_SS.addEventListener("mousedown", toggleSound);
  }

  tearDown() {
    super.tearDown();

    const { imageObj, ssObj } = globals;

    createjs.Ticker.removeEventListener("tick", this.progress);

    imageObj.BUTTON_START.removeEventListener("mousedown", onClick2SinglePlay);
    imageObj.BUTTON_START_ONLINE.removeEventListener(
      "mousedown",
      onClick2MultiPlay
    );
    imageObj.BUTTON_HOW_TO.removeEventListener("mousedown", onClick2HowToPlay);
    imageObj.BUTTON_SELECT_CHARA.removeEventListener(
      "mousedown",
      onClick2ChangeChara
    );
    imageObj.BUTTON_RANKING.removeEventListener("mousedown", onClick2Ranking);
    imageObj.BUTTON_CREDIT.removeEventListener("mousedown", onClick2Credit);
    imageObj.BUTTON_TWITTER_LOGIN.removeEventListener(
      "mousedown",
      onClickLogin
    );
    imageObj.BUTTON_TWITTER_LOGOUT.removeEventListener(
      "mousedown",
      onClickLogout
    );
    imageObj.BUTTON_TWITTER_TOP.removeEventListener(
      "mousedown",
      onClickTwitter
    );
    ssObj.BUTTON_SOUND_SS.removeEventListener("mousedown", toggleSound);
  }

  progress() {
    globals.gameStage.update();
  }
}

function onClick2SinglePlay() {
  globals.soundObj.SOUND_ZENKAI.stop();
  globals.soundObj.SOUND_OK.play();

  to(GameEngine);
}

function onClick2MultiPlay() {
  globals.soundObj.SOUND_OK.play();

  openModal({
    title: "オンライン対戦",
    text:
      "招待用URLからゲームにアクセスすることで、あなたと対戦が行えます。\n" +
      "このダイアログを閉じてしまうとルームが削除されてしまいます。リロードやツイート時は気を付けてください。",
    actions: [
      {
        text: "Copy URL",
        autoClose: false,
        tooltipText: "コピーしました!",
        onClick: () => {
          const url = getCurrentUrl();
          const peerId = P2PClient.get().peerId;

          copyTextToClipboard(`${url}?peerId=${peerId}`);
        }
      },
      { text: "Twitter" },
      { text: "cancel", type: "cancel" }
    ]
  });
}

function onClick2HowToPlay() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  to(HowToPlayEngine);
}

function onClick2Ranking() {
  window.location.href =
    "http://games.sokontokoro-factory.net/ranking/?game=honocar";
}

function onClick2Credit() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  to(CreditEngine);
}

function onClick2ChangeChara() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  to(SelectCharaEngine);
}

function toggleSound() {
  const { soundObj, ssObj } = globals;

  soundObj.SOUND_TURN_SWITCH.play();
  if (globals.isSoundMute) {
    ssObj.BUTTON_SOUND_SS.gotoAndPlay("on");
    soundTurnOn();
  } else {
    ssObj.BUTTON_SOUND_SS.gotoAndPlay("off");
    soundTurnOff();
  }
}

function onClickLogin() {
  window.location.href = config.api.login;
}

function onClickLogout() {
  const { soundObj } = globals;

  soundObj.SOUND_OK.play();
  alertify.confirm(
    "ログアウトします。ランキング登録はログイン中のみ有効です。",
    function(result) {
      if (result) {
        soundObj.SOUND_OK.play();
        window.location.href = config.api.logout;
      } else {
        soundObj.SOUND_BACK.play();
      }
    }
  );
}

function onClickTwitter() {
  window.location.href = config.link.t28_twitter;
}

export default new MenuEngine();
