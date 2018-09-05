import { parse } from "query-string";
import {
  P2PClient,
  getLogger,
  openModal,
  closeModal
} from "@sokontokoro/mikan";

import { init as initGameEngine } from "./gameEngine";
import { init as initOnlineGameEngine } from "./OnlineGameEngine";
import { init as initHowToPlay } from "./howToPlayEngine";
import { postPlayLog, registration } from "./api";
import { loadContent } from "./contentsLoader";
import globals from "./globals";
import { P2PEvents } from "./constants";

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

  p2p.once(P2PClient.EVENTS.CONNECT, () => {
    logger.debug("success to connect to peer.");
    const offset = 2 * 1000; //[ms]

    openModal({ title: "準備完了", actions: [] });

    setTimeout(() => {
      soundObj.SOUND_ZENKAI.stop();
      closeModal();

      onlineGameState();
    }, offset);
  });

  const { peerId } = parse(window.location.search);
  if (peerId) {
    console.debug("user has remote peer id. try to connect.", peerId);
    p2p.connect(peerId);
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

  globals.gameStage.removeAllChildren();

  initGameEngine();
}

// ゲーム画面------------------------------------------
export function onlineGameState() {
  logger.debug("start OnlineGameState.");

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

export function onlineGameOverState(win) {
  logger.debug("start OnlineGameOverState.");
  logger.debug("player is win?", win);

  const {
    gameStage,
    player,
    opponent,
    playCharacter,
    ssObj,
    imageObj,
    textObj
  } = globals;

  if (win) {
    opponent.img.gotoAndPlay("down");
  } else {
    player.img.gotoAndPlay("down");
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
  gameStage.addChild(imageObj.GAMEOVER);

  globals.tickListener = createjs.Ticker.addEventListener("tick", function() {
    gameStage.update();
  });

  P2PClient.get().once(P2PClient.EVENTS.DATA, ({ message }) => {
    if (message.type === P2PEvents.RESTART) {
      const message = {
        type: P2PEvents.RESTART_ACCEPT
      };
      P2PClient.get().send(message);

      onlineGameState();
    }
  });
}
