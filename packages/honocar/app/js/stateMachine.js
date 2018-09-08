import { parse } from "query-string";
import {
  P2PClient,
  getLogger,
  openModal,
  closeModal,
  getCurrentUrl
} from "@sokontokoro/mikan";

import { init as initGameEngine } from "./gameEngine";
import {
  init as initOnlineGameEngine,
  teerDown as teerDownOnlineGameEngine
} from "./OnlineGameEngine";
import { init as initHowToPlay } from "./howToPlayEngine";
import { postPlayLog, registration } from "./api";
import { loadContent } from "./contentsLoader";
import globals from "./globals";
import { P2PEvents } from "./constants";
import { trySyncGameStart } from "./common";

const logger = getLogger("state-machine");

// ロード画面------------------------------------------
export function loadState() {
  loadContent(topState);
}

// TOP画面------------------------------------------
export function topState() {
  logger.debug("start TopState");

  const { playCharacter, gameStage, imageObj, textObj, soundObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);

  switch (playCharacter) {
    case "honoka":
      gameStage.addChild(imageObj.TITLE_LOGO);
      break;
    case "erichi":
      gameStage.addChild(imageObj.TITLE_LOGO_E);
      break;
  }

  gameStage.addChild(textObj.TEXT_START);

  gameStage.update();

  if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
    soundObj.SOUND_ZENKAI.play({
      loop: -1,
      volume: 0.4
    });
  }

  function gotoMenu() {
    globals.soundObj.SOUND_OK.play();
    menuState();
    globals.imageObj.GAME_BACKGROUND.removeEventListener("click", gotoMenu);
  }

  imageObj.GAME_BACKGROUND.addEventListener("click", gotoMenu);

  // check online game state
  const p2p = P2PClient.get(process.env.SKYWAY_KEY);

  const remotePeerId = parse(window.location.search).peerId;

  p2p.once(P2PClient.EVENTS.CONNECT, () => {
    logger.info("success to connect to peer.");
    openModal({
      title: "準備完了",
      text: "オンライン対戦を開始します。",
      actions: []
    });

    const firstMessageSender = !remotePeerId; // connectionRequestReceiver

    trySyncGameStart(firstMessageSender).then(() => {
      soundObj.SOUND_ZENKAI.stop();
      closeModal();

      onlineGameState();
    });
  });

  p2p.once(P2PClient.EVENTS.CLOSE, params => {
    logger.info("close connection to peer.", params);

    if (!params.isByMyself) {
      teerDownOnlineGameEngine();

      openModal({
        title: "ゲーム終了",
        text: "通信相手の接続が切れてしまいました。Topに戻ります。",
        actions: []
      });

      setTimeout(() => {
        closeModal();
        topState();
      }, 3000);
    }
  });

  if (remotePeerId) {
    console.debug(`user has remote peer id. try to connect to ${remotePeerId}`);
    // clearQueryString
    history.replaceState(null, null, getCurrentUrl());
    p2p.connect(remotePeerId);
  }
}

// MENU画面------------------------------------------
export function menuState() {
  logger.debug("start MenuState");

  const { playCharacter, gameStage, imageObj, ssObj, soundObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.WHITE_SHEET);

  if (globals.isLogin) {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGOUT);
    gameStage.addChild(imageObj.TWITTER_ICON);
  } else {
    gameStage.addChild(imageObj.BUTTON_TWITTER_LOGIN);
  }

  gameStage.addChild(imageObj.BUTTON_START);
  gameStage.addChild(imageObj.BUTTON_START_ONLINE);
  gameStage.addChild(imageObj.BUTTON_HOW_TO);
  gameStage.addChild(imageObj.BUTTON_RANKING);
  gameStage.addChild(imageObj.BUTTON_CREDIT);
  gameStage.addChild(imageObj.BUTTON_TWITTER_TOP);
  gameStage.addChild(ssObj.BUTTON_SOUND_SS);
  gameStage.addChild(imageObj.MENU_LOGO);

  ssObj.BUTTON_CHANGE_CHARA.gotoAndPlay(playCharacter);
  gameStage.addChild(ssObj.BUTTON_CHANGE_CHARA);

  if (soundObj.SOUND_ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED) {
    soundObj.SOUND_ZENKAI.play({ loop: -1, volume: 0.4 });
  }

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}
//操作説明画面------------------------------------------
export function howToPlayState() {
  logger.debug("start HowToPlayState");

  globals.gameStage.removeAllChildren();

  initHowToPlay();
}
//クレジット画面------------------------------------------
export function creditState() {
  logger.debug("start CreditState");

  const { gameStage, imageObj, textObj } = globals;

  gameStage.removeAllChildren();
  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(imageObj.BUTTON_BACK_TOP_FROM_CREDIT);
  gameStage.addChild(textObj.TEXT_LINK_ME);
  gameStage.addChild(textObj.TEXT_LINK_SAN);
  gameStage.addChild(textObj.TEXT_LINK_LOVELIVE);
  gameStage.addChild(textObj.TEXT_LINK_1);
  gameStage.addChild(textObj.TEXT_LINK_2);

  gameStage.update();
}

// ゲーム画面------------------------------------------
export function gameState() {
  logger.debug("start GameState.");

  createjs.Ticker.removeEventListener("tick", globals.tickListener);
  globals.gameStage.removeAllChildren();

  initGameEngine();
}

// ゲーム画面------------------------------------------
export function onlineGameState() {
  logger.debug("start OnlineGameState.");

  createjs.Ticker.removeEventListener("tick", globals.tickListener);
  globals.gameStage.removeAllChildren();

  initOnlineGameEngine();
}
// GAMEOVER画面------------------------------------------
export function gameOverState() {
  logger.debug("start GameOverState.");

  const {
    gameStage,
    player,
    playCharacter,
    ssObj,
    imageObj,
    textObj
  } = globals;

  if (globals.isLogin) {
    registration();
  }
  postPlayLog();

  player.img.gotoAndPlay("down");

  gameStage.removeAllChildren();

  switch (playCharacter) {
    case "honoka":
      ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
      break;
    case "erichi":
      ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("erichi");
      break;
  }

  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(player.img);
  gameStage.addChild(imageObj.BUTTON_BACK_TOP);
  gameStage.addChild(imageObj.BUTTON_RESTART);
  gameStage.addChild(ssObj.BUTTON_TWITTER_GAMEOVER_SS);
  gameStage.addChild(textObj.TEXT_GAME_COUNT);
  gameStage.addChild(imageObj.GAMEOVER);

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });
}

/**
 *
 * @param result (win|lose|draw)
 */
export function onlineGameOverState(result) {
  logger.debug("start OnlineGameOverState.");
  logger.debug("this game is " + result);

  const {
    gameStage,
    player,
    opponent,
    playCharacter,
    ssObj,
    imageObj,
    textObj
  } = globals;

  if (result === "win") {
    opponent.img.gotoAndPlay("down");
  }
  if (result === "lose") {
    player.img.gotoAndPlay("down");
  }
  if (result === "draw") {
    player.img.gotoAndPlay("down");
    opponent.img.gotoAndPlay("down");
  }

  gameStage.removeAllChildren();

  switch (playCharacter) {
    case "honoka":
      ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("honoka");
      break;
    case "erichi":
      ssObj.BUTTON_TWITTER_GAMEOVER_SS.gotoAndPlay("erichi");
      break;
  }

  gameStage.addChild(imageObj.GAME_BACKGROUND);
  gameStage.addChild(opponent.img);
  gameStage.addChild(player.img);
  gameStage.addChild(imageObj.BUTTON_BACK_TOP_ONLINE);
  gameStage.addChild(imageObj.BUTTON_RESTART_ONLINE);
  gameStage.addChild(ssObj.BUTTON_TWITTER_GAMEOVER_SS);
  gameStage.addChild(textObj.TEXT_GAME_COUNT);

  if (result === "win") {
    gameStage.addChild(imageObj.GAMEOVER_WIN);
  }
  if (result === "lose") {
    gameStage.addChild(imageObj.GAMEOVER_LOSE);
  }
  if (result === "draw") {
    gameStage.addChild(imageObj.GAMEOVER_DRAW);
  }

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });

  function onDataReceived({ message }) {
    if (message.type === P2PEvents.RESTART) {
      P2PClient.get().off(P2PClient.EVENTS.DATA, onDataReceived);

      openModal({
        title: "もう一度遊びますか？",
        text: "対戦相手が再戦を求めています！",
        actions: [
          {
            text: "OK",
            autoClose: true,
            onClick: () => {
              const message = {
                type: P2PEvents.RESTART_ACCEPT
              };
              P2PClient.get().send(message);

              openModal({
                title: "準備完了！",
                text: "オンライン対戦を開始します。",
                actions: []
              });

              trySyncGameStart(false).then(() => {
                closeModal();
                onlineGameState();
              });
            }
          },
          {
            text: "NO",
            onClick: () => {
              P2PClient.get().disconnect();
              teerDownOnlineGameEngine();

              globals.soundObj.SOUND_BACK.play();
              topState();
            }
          }
        ]
      });
    }
  }
  P2PClient.get().on(P2PClient.EVENTS.DATA, onDataReceived);
}
