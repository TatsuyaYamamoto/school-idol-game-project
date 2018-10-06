import * as alertify from "alertify/lib/alertify";
import {
  openModal,
  t,
  openExternalSite,
  signInAsTwitterUser,
  signOut
} from "@sokontokoro/mikan";

import globals from "../globals";
import Engine from "./Engine";
import { soundTurnOff, soundTurnOn } from "../contentsLoader";
import CreditEngine from "./CreditEngine";
import HowToPlayEngine from "./HowToPlayEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import SelectCharaEngine from "./SelectCharaEngine";
import { Ids } from "../resources/string";
import { tracePage, trackEvent, TRACK_ACTION, TRACK_PAGES } from "../tracker";

class MenuEngine extends Engine {
  constructor(props) {
    super(props);

    this.characterSelectButton = null;
  }

  init() {
    super.init();

    tracePage(TRACK_PAGES.MENU);

    const { gameStage, imageObj, ssObj, soundObj, playCharacter } = globals;

    switch (playCharacter) {
      case "honoka":
        this.characterSelectButton = imageObj.BUTTON_SELECT_CHARA_HONOKA;
        break;
      case "eri":
        this.characterSelectButton = imageObj.BUTTON_SELECT_CHARA_ERI;
        break;
      case "kotori":
        this.characterSelectButton = imageObj.BUTTON_SELECT_CHARA_KOTORI;
        break;
    }

    gameStage.removeAllChildren();
    gameStage.addChild(imageObj.GAME_BACKGROUND);
    gameStage.addChild(imageObj.WHITE_SHEET);

    if (globals.isLogin) {
      gameStage.addChild(imageObj.BUTTON_TWITTER_LOGOUT);
      gameStage.addChild(imageObj.TWITTER_ICON);
    } else {
      gameStage.addChild(imageObj.BUTTON_TWITTER_LOGIN);
    }

    gameStage.addChild(this.characterSelectButton);
    gameStage.addChild(imageObj.MENU_BACKGROUND);

    gameStage.addChild(imageObj.BUTTON_START);
    gameStage.addChild(imageObj.BUTTON_START_ONLINE);
    gameStage.addChild(imageObj.BUTTON_HOW_TO);
    gameStage.addChild(imageObj.BUTTON_RANKING);
    gameStage.addChild(imageObj.BUTTON_CREDIT);
    gameStage.addChild(imageObj.BUTTON_TWITTER_TOP);
    gameStage.addChild(ssObj.BUTTON_SOUND_SS);

    if (soundObj.SOUND_ZENKAI.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      soundObj.SOUND_ZENKAI.play({ loop: -1, volume: 0.4 });
    }

    createjs.Ticker.addEventListener("tick", this.progress);

    imageObj.BUTTON_START.addEventListener("mousedown", onClick2SinglePlay);
    imageObj.BUTTON_START_ONLINE.addEventListener(
      "mousedown",
      onClick2MultiPlay
    );
    imageObj.BUTTON_HOW_TO.addEventListener("mousedown", onClick2HowToPlay);
    this.characterSelectButton.addEventListener(
      "mousedown",
      onClick2ChangeChara
    );
    imageObj.BUTTON_RANKING.addEventListener("mousedown", onClick2Ranking);
    imageObj.BUTTON_CREDIT.addEventListener("mousedown", onClick2Credit);
    imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", onClickLogin);
    imageObj.BUTTON_TWITTER_LOGOUT.addEventListener("mousedown", onClickLogout);
    imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", onClickHome);
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
    this.characterSelectButton.removeEventListener(
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
    imageObj.BUTTON_TWITTER_TOP.removeEventListener("mousedown", onClickHome);
    ssObj.BUTTON_SOUND_SS.removeEventListener("mousedown", toggleSound);

    this.characterSelectButton = null;
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
    title: "オンライン対戦モード近日公開！",
    text: "鋭意開発ちゅん!",
    actions: [{ text: "OK" }]
  });

  // openModal({
  //   title: t(Ids.ONLINE_DIALOG_PREPARE_TITLE),
  //   text: t(Ids.ONLINE_DIALOG_PREPARE_TEXT),
  //   actions: [
  //     {
  //       text: t(Ids.ONLINE_DIALOG_PREPARE_CLIPBOARD),
  //       autoClose: false,
  //       tooltipText: t(Ids.ONLINE_DIALOG_PREPARE_COPY_SUCCESS),
  //       onClick: () => {
  //         const url = getCurrentUrl();
  //         const peerId = P2PClient.get().peerId;
  //
  //         copyTextToClipboard(`${url}?peerId=${peerId}`);
  //       }
  //     },
  //     { text: "Twitter" },
  //     { text: "cancel", type: "cancel" }
  //   ]
  // });
}

function onClick2HowToPlay() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  to(HowToPlayEngine);
}

function onClick2Ranking() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  const url = "http://games.sokontokoro-factory.net/ranking/?game=honocar";

  openModal({
    text: t(Ids.OPEN_EXTERNAL_SITE_INFO, {
      url: "games.sokontokoro-factory.net"
    }),
    actions: [
      {
        text: "OK",
        onClick: () => {
          trackEvent(TRACK_ACTION.CLICK, { label: "ranking" });
          openExternalSite(url);
        }
      },
      {
        text: "CANCEL",
        type: "cancel"
      }
    ]
  });
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

    trackEvent(TRACK_ACTION.CLICK, { label: "sound_on" });
  } else {
    ssObj.BUTTON_SOUND_SS.gotoAndPlay("off");
    soundTurnOff();

    trackEvent(TRACK_ACTION.CLICK, { label: "sound_off" });
  }
}

function onClickLogin() {
  trackEvent(TRACK_ACTION.CLICK, { label: "login" });

  signInAsTwitterUser();
}

function onClickLogout() {
  trackEvent(TRACK_ACTION.CLICK, { label: "logout" });

  const { soundObj } = globals;

  soundObj.SOUND_OK.play();
  alertify.confirm(t(Ids.LOGOUT_MESSAGE), function(result) {
    if (result) {
      soundObj.SOUND_OK.play();

      signOut().then(() => {
        location.reload();
      });
    } else {
      soundObj.SOUND_BACK.play();
    }
  });
}

function onClickHome() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  const url = "http://www.sokontokoro-factory.net/";

  openModal({
    text: t(Ids.OPEN_EXTERNAL_SITE_INFO, {
      url: "www.sokontokoro-factory.net"
    }),
    actions: [
      {
        text: "OK",
        onClick: () => {
          trackEvent(TRACK_ACTION.CLICK, { label: "home" });
          openExternalSite(url);
        }
      },
      {
        text: "CANCEL",
        type: "cancel"
      }
    ]
  });
}

export default new MenuEngine();
