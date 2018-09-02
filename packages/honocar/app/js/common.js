import * as alertify from "alertify/lib/alertify";
import {
  copyTextToClipboard,
  openModal,
  P2PClient,
  getCurrentUrl
} from "@sokontokoro/mikan";

import config from "./resources/config";
import globals from "./globals";
import {
  creditState,
  gameState,
  howToPlayState,
  menuState,
  topState
} from "./stateMachine";
import { soundTurnOff, soundTurnOn } from "./contentsLoader";
import { clickButtonLeft, clickButtonRight } from "./gameEngine";

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

//イベントリスナー登録--------------------------------

export function addAllEventListener() {
  const { imageObj, soundObj, textObj, ssObj } = globals;

  imageObj.BUTTON_RIGHT.addEventListener("mousedown", clickButtonRight);

  imageObj.BUTTON_LEFT.addEventListener("mousedown", clickButtonLeft);

  imageObj.BUTTON_START.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_ZENKAI.stop();
    soundObj.SOUND_OK.play();
    gameState();
  });

  imageObj.BUTTON_ONLINE_START.addEventListener("mousedown", function() {
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

  imageObj.BUTTON_BACK_TOP.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_BACK.play();
    menuState();
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

  imageObj.BUTTON_RESTART.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", globals.tickListener);
    soundObj.SOUND_BACK.play();
    gameState();
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
