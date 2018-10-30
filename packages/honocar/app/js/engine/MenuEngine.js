import {
  openModal,
  t,
  openExternalSite,
  signInAsTwitterUser,
  signOut,
  tracePage,
  trackEvent,
  getCurrentUrl,
  copyTextToClipboard
} from "@sokontokoro/mikan";

import globals from "../globals";
import Engine from "./Engine";
import { getClient, initClient } from "../common";

import { soundTurnOff, soundTurnOn } from "../contentsLoader";
import CreditEngine from "./CreditEngine";
import HowToPlayEngine from "./HowToPlayEngine";
import GameEngine from "./GameEngine";
import { to } from "../stateMachine";
import SelectCharaEngine from "./SelectCharaEngine";

import { Ids } from "../resources/string";
import {
  default as config,
  TRACK_ACTION,
  TRACK_PAGES
} from "../resources/config";

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

    if (!globals.loginUser.isAnonymous) {
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

  // TODO Show progress indicator
  initClient().then(() => {
    const client = getClient();
    client.createRoom("honocar").then(roomDoc => {
      const roomName = roomDoc.name;

      openModal({
        title: t(Ids.ONLINE_DIALOG_PREPARE_TITLE),
        text: t(Ids.ONLINE_DIALOG_PREPARE_TEXT),
        actions: [
          {
            text: t(Ids.ONLINE_DIALOG_PREPARE_CLIPBOARD),
            autoClose: false,
            tooltipText: t(Ids.ONLINE_DIALOG_PREPARE_COPY_SUCCESS),
            onClick: () => {
              const url = getCurrentUrl();
              copyTextToClipboard(`${url}?roomName=${roomName}`);
            }
          },
          { text: "Twitter" },
          { text: "cancel", type: "cancel" }
        ]
      });
    });
  });
}

function onClick2HowToPlay() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  to(HowToPlayEngine);
}

function onClick2Ranking() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  openModal({
    text: t(Ids.OPEN_RANKING_INFO),
    actions: [
      {
        text: "OK",
        onClick: () => {
          globals.soundObj.SOUND_OK.stop();
          globals.soundObj.SOUND_OK.play();

          trackEvent(TRACK_ACTION.CLICK, { label: "ranking" });
          openExternalSite(config.link.ranking, false);
        }
      },
      {
        text: "CANCEL",
        type: "cancel",
        onClick: () => {
          globals.soundObj.SOUND_BACK.stop();
          globals.soundObj.SOUND_BACK.play();
        }
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
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  trackEvent(TRACK_ACTION.CLICK, { label: "login" });

  signInAsTwitterUser();
}

function onClickLogout() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  trackEvent(TRACK_ACTION.CLICK, { label: "logout" });

  signOut().then(() => {
    location.reload();
  });
}

function onClickHome() {
  globals.soundObj.SOUND_OK.stop();
  globals.soundObj.SOUND_OK.play();

  openModal({
    text: t(Ids.OPEN_HOMEPAGE_INFO),
    actions: [
      {
        text: "OK",
        onClick: () => {
          globals.soundObj.SOUND_OK.stop();
          globals.soundObj.SOUND_OK.play();

          trackEvent(TRACK_ACTION.CLICK, { label: "home" });
          openExternalSite(config.link.homepage, false);
        }
      },
      {
        text: "CANCEL",
        type: "cancel",
        onClick: () => {
          globals.soundObj.SOUND_BACK.stop();
          globals.soundObj.SOUND_BACK.play();
        }
      }
    ]
  });
}

export default new MenuEngine();
