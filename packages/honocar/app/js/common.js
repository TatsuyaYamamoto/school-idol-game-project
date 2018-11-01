import config from "./resources/config";
import globals from "./globals";

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

import { SkyWayClient, getLogger } from "@sokontokoro/mikan";

const logger = getLogger("common");
const apiKeyConfig = require("../../../../package.json").config.sokontokoro
  .skyWayApiKey;

const skyWayApiKey =
  process.env.NODE_ENV === "production" ? apiKeyConfig.pro : apiKeyConfig.dev;

let CLIENT;

export function initClient() {
  if (CLIENT && CLIENT.isPeerOpen) {
    return Promise.resolve();
  }

  return SkyWayClient.createClient(skyWayApiKey).then(client => {
    CLIENT = client;
  });
}

export function getClient() {
  if (!CLIENT) {
    throw new Error("not initialized");
  }

  return CLIENT;
}

export function unixtimeToRoundSeconds(unixtime) {
  return Math.floor(unixtime / 1000);
}
