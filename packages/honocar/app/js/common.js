import * as alertify from "alertify/lib/alertify";
import {
  copyTextToClipboard,
  openModal,
  P2PClient,
  getCurrentUrl,
  closeModal
} from "@sokontokoro/mikan";

import config from "./resources/config";
import globals from "./globals";
import {
  creditState,
  gameState,
  howToPlayState,
  menuState,
  onlineGameState,
  topState
} from "./stateMachine";
import { soundTurnOff, soundTurnOn } from "./contentsLoader";
import { clickButtonLeft, clickButtonRight } from "./gameEngine";
import {
  clickButtonLeft as clickButtonLeftOnline,
  clickButtonRight as clickButtonRightOnline,
  teerDown as teerDownOnlineGameEngine
} from "./OnlineGameEngine";
import { P2PEvents } from "./constants";

//ゲームスクリーンサイズ初期化用-----------------------
export function initGameScreenScale() {
  if (
    window.innerHeight / window.innerWidth <
    config.system.gamescrean.height / config.system.gamescrean.width
  ) {
    globals.gameScreenScale =
      window.innerHeight / config.system.gamescrean.height;
  } else {
    globals.gameScreenScale =
      window.innerWidth / config.system.gamescrean.width;
  }

  globals.gameScrean.height =
    config.system.gamescrean.height * globals.gameScreenScale;
  globals.gameScrean.width =
    config.system.gamescrean.width * globals.gameScreenScale;
}

// tweet文言----------------
function getTweetText() {
  let tweet_text;

  switch (playCharacter) {
    case "honoka":
      if (passCarCount === 0) {
        tweet_text =
          "穂乃果「いやー、今日もパンがうまいっ！」海未「また運動もせずにそんなものを食べて！」";
      } else if (passCarCount < 100) {
        tweet_text =
          "穂乃果「ことりちゃーん！穂乃果、" +
          gameScore +
          "台も車を避けたのに、海未ちゃんちっとも褒めてくれないよー！」";
      } else if (passCarCount >= 100) {
        tweet_text =
          "海未「なにやっていたんですか！！どれだけ避けたと思っているんですか...」穂乃果「" +
          passCarCount +
          "台！」";
      }
      break;
    case "erichi":
      if (passCarCount === 0) {
        tweet_text = "(車なんて避けてないで)エリチカ、おうちにかえる!!!";
      } else if (gameScore < 100) {
        tweet_text =
          passCarCount +
          "台よ...なんとか避けなくちゃいけないんだから、しょうがないじゃないチカ！";
      } else if (passCarCount >= 100) {
        tweet_text = passCarCount + "台！ハラショー！";
      }
      break;
  }
  return tweet_text;
}

// P2P --------------------------------------------
export function trySyncGameStart(sernder) {
  const offset = 2 * 1000; //[ms]
  const p2p = P2PClient.get();

  return new Promise(resolve => {
    if (sernder) {
      sendSyncStartMessage(offset);
    } else {
      P2PClient.get().on(P2PClient.EVENTS.DATA, onDataReceived);
    }

    function sendSyncStartMessage(offset) {
      const now = Date.now();
      const message = {
        type: P2PEvents.START,
        detail: {
          startTime: now + offset
        }
      };

      p2p.send(message);

      setTimeout(resolve, offset);
    }

    function onDataReceived(data) {
      if (data.message.type === P2PEvents.START) {
        p2p.off(P2PClient.EVENTS.DATA, onDataReceived);

        const now = Date.now();
        const offset = data.message.detail.startTime - now;

        if (0 < offset) {
          setTimeout(resolve, offset);
        } else {
          resolve();
        }
      }
    }
  });
}

//イベントリスナー登録--------------------------------

export function addAllEventListener() {
  const { imageObj, soundObj, textObj, ssObj } = globals;

  /**
   * GameStateの右移動ボタン
   */
  imageObj.BUTTON_RIGHT.addEventListener("mousedown", clickButtonRight);

  /**
   * GameStateの左移動ボタン
   */
  imageObj.BUTTON_LEFT.addEventListener("mousedown", clickButtonLeft);

  /**
   * OnlineGameStateの右移動ボタン
   */
  imageObj.BUTTON_RIGHT_ONLINE.addEventListener(
    "mousedown",
    clickButtonRightOnline
  );

  /**
   * OnlineGameStateの左移動ボタン
   */
  imageObj.BUTTON_LEFT_ONLINE.addEventListener(
    "mousedown",
    clickButtonLeftOnline
  );

  imageObj.BUTTON_START.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);

    soundObj.SOUND_ZENKAI.stop();
    soundObj.SOUND_OK.play();

    gameState();
  });

  imageObj.BUTTON_START_ONLINE.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);

    soundObj.SOUND_OK.play();

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
  });

  imageObj.BUTTON_HOW_TO.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_OK.play();
    howToPlayState();
  });
  imageObj.BUTTON_RANKING.addEventListener("mousedown", function() {
    window.location.href =
      "http://games.sokontokoro-factory.net/ranking/?game=honocar";
  });

  imageObj.BUTTON_CREDIT.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_OK.play();
    creditState();
  });

  /**
   * GameOverStateからTopStateへ遷移するボタン
   */
  imageObj.BUTTON_BACK_TOP.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_BACK.play();
    topState();
  });

  /**
   * OnlineGameOverStateからTopStateへ遷移するボタン
   */
  imageObj.BUTTON_BACK_TOP_ONLINE.addEventListener("mousedown", function() {
    P2PClient.get().disconnect();
    teerDownOnlineGameEngine();

    soundObj.SOUND_BACK.play();
    topState();
  });

  imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.addEventListener(
    "mousedown",
    function() {
      createjs.Tween.removeTweens(globals.player.img);
      soundObj.SOUND_BACK.play();
      createjs.Ticker.removeEventListener("tick", globals.tickListener);
      menuState();
    }
  );

  imageObj.BUTTON_BACK_TOP_FROM_CREDIT.addEventListener(
    "mousedown",
    function() {
      soundObj.SOUND_BACK.play();
      menuState();
    }
  );

  /**
   * GameOverStateからGameStateへ遷移(リプレイ)
   */
  imageObj.BUTTON_RESTART.addEventListener("mousedown", function() {
    soundObj.SOUND_BACK.play();
    gameState();
  });

  /**
   * OnlineGameOverStateからOnlineGameStateへ遷移(リプレイ)
   */
  imageObj.BUTTON_RESTART_ONLINE.addEventListener("mousedown", function() {
    soundObj.SOUND_BACK.play();

    openModal({
      title: "対戦相手の入力待っています！",
      actions: []
    });

    function onDataReceived({ message }) {
      if (message.type === P2PEvents.RESTART_ACCEPT) {
        P2PClient.get().off(P2PClient.EVENTS.DATA, onDataReceived);

        openModal({
          title: "準備完了！",
          text: "オンライン対戦を開始します。",
          actions: []
        });

        trySyncGameStart(true).then(() => {
          closeModal();
          onlineGameState();
        });
      }
    }

    P2PClient.get().on(P2PClient.EVENTS.DATA, onDataReceived);

    // TODO restartイベントをonする前にmessageを送信する可能性がある。
    const message = {
      type: P2PEvents.RESTART
    };
    P2PClient.get().send(message);
  });

  ssObj.BUTTON_SOUND_SS.addEventListener("mousedown", function() {
    soundObj.SOUND_TURN_SWITCH.play();
    if (globals.isSoundMute) {
      ssObj.BUTTON_SOUND_SS.gotoAndPlay("on");
      soundTurnOn();
    } else {
      ssObj.BUTTON_SOUND_SS.gotoAndPlay("off");
      soundTurnOff();
    }
  });

  imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", function() {
    window.location.href = config.api.login;
  });
  imageObj.BUTTON_TWITTER_LOGOUT.addEventListener("mousedown", function() {
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
  });

  imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", function() {
    window.location.href = config.link.t28_twitter;
  });

  ssObj.BUTTON_TWITTER_GAMEOVER_SS.addEventListener("mousedown", function() {
    window.location.href =
      "https://twitter.com/intent/tweet" +
      "?hashtags=ほのCar!+%23そこんところ工房" +
      "&text=" +
      getTweetText() +
      "&url=http://games.sokontokoro-factory.net/honocar/";
  });
  ssObj.BUTTON_CHANGE_CHARA.addEventListener("mousedown", function() {
    soundObj.SOUND_OK.play();

    switch (globals.playCharacter) {
      case "honoka":
        globals.playCharacter = "erichi";
        break;
      case "erichi":
        globals.playCharacter = "honoka";
        break;
    }

    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    topState();
  });
  textObj.TEXT_LINK_1.addEventListener("mousedown", function() {
    window.location.href = config.link.soundeffect;
  });
  textObj.TEXT_LINK_2.addEventListener("mousedown", function() {
    window.location.href = config.link.on_jin;
  });
  textObj.TEXT_LINK_ME.addEventListener("mousedown", function() {
    window.location.href = config.link.sokontokoro;
  });
  textObj.TEXT_LINK_SAN.addEventListener("mousedown", function() {
    window.location.href = config.link.sanzashi;
  });
  window.addEventListener("blur", function() {
    soundTurnOff();
  });
  window.addEventListener("focus", function() {
    soundTurnOn();
  });
}
