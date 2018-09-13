import { P2PClient } from "@sokontokoro/mikan";

import config from "./resources/config";
import globals from "./globals";
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
export function getTweetText(passCarCount, playCharacter) {
  let text;

  switch (playCharacter) {
    case "honoka":
      if (passCarCount === 0) {
        text =
          "穂乃果「いやー、今日もパンがうまいっ！」海未「また運動もせずにそんなものを食べて！」";
      } else if (passCarCount < 100) {
        text =
          "穂乃果「ことりちゃーん！穂乃果、" +
          passCarCount +
          "台も車を避けたのに、海未ちゃんちっとも褒めてくれないよー！」";
      } else if (passCarCount >= 100) {
        text =
          "海未「なにやっていたんですか！！どれだけ避けたと思っているんですか...」穂乃果「" +
          passCarCount +
          "台！」";
      }
      break;

    case "eri":
      if (passCarCount === 0) {
        text = "(車なんて避けてないで)エリチカ、おうちにかえる!!!";
      } else if (passCarCount < 100) {
        text =
          passCarCount +
          "台よ...なんとか避けなくちゃいけないんだから、しょうがないじゃないチカ！";
      } else if (passCarCount >= 100) {
        text = passCarCount + "台！ハラショー！";
      }
      break;

    case "kotori":
      if (passCarCount === 0) {
        text =
          "チガイマースッ！ソレデハ、ゴキゲンヨウー！ヨキニハカラエ〜ミンナノシュウ...";
      } else if (passCarCount < 100) {
        text =
          passCarCount +
          "台...店内のイベントで歌わされて...自動車、道路で避けるの...禁止だったのに";
      } else if (100 <= passCarCount) {
        text =
          "ふわふわしたものかわいいな、はいっ！あとは自動車たくさん(" +
          passCarCount +
          "台)回避したら？カラフルで幸せー";
      }
      break;
  }
  return text;
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
