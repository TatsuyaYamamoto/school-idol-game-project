import "alertify/themes/alertify.core.css";
import "alertify/themes/alertify.default.css";

import "createjs/builds/1.0.0/createjs.js";

import "../main.css";

import * as alertify from "alertify/lib/alertify";
import {
  config as mikanConfig,
  initI18n,
  isSupportTouchEvents,
  pointerdown,
  t,
  initAuth
} from "@sokontokoro/mikan";

import { to } from "./stateMachine";
import config from "./resources/config";
import { default as stringResources, Ids } from "./resources/string";
import { initGameScreenScale } from "./common";
import {
  loadContent,
  setTextProperties,
  soundTurnOff,
  soundTurnOn
} from "./contentsLoader";
import globals from "./globals";
import TopEngine from "./engine/TopEngine";
import { tracePage, TRACK_PAGES } from "./tracker";

function init() {
  tracePage(TRACK_PAGES.INDEX);

  /*---------- ログインチェック ----------*/
  globals.loginPromise = initAuth()
    .then(user => {
      if (!user.isAnonymous) {
        alertify.log(t(Ids.LOGIN_SUCCESS), "success", 3000);

        globals.user.iconUrl = user.photoURL;
      }
    })
    .catch(e => {
      globals.isLogin = false;
    });

  //ゲーム画面の初期
  globals.gameStage = new createjs.Stage("gameScrean");

  globals.gameScrean = document.getElementById("gameScrean");

  if (isSupportTouchEvents()) {
    createjs.Touch.enable(globals.gameStage, true, true);
  }

  //拡大縮小率の計算
  initGameScreenScale();

  const loading = new createjs.Text();
  setTextProperties(
    loading,
    globals.gameScrean.width * 0.5,
    globals.gameScrean.height * 0.5,
    globals.gameScrean.width * 0.04,
    "Courier",
    "center",
    globals.gameScrean.width * 0.04
  );
  loading.text = "loading...";
  globals.gameStage.addChild(loading);
  globals.gameStage.update();

  // toggle sound with blur or focus
  window.addEventListener("blur", function() {
    soundTurnOff();
  });
  window.addEventListener("focus", function() {
    soundTurnOn();
  });

  //ゲーム用タイマーの設定
  createjs.Ticker.framerate = config.system.framerate;
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

  // TODO createjsにcross originの画像を読み込まない
  createjs.DisplayObject.suppressCrossDomainErrors = true;

  // Initialize internationalization.
  mikanConfig.defaultLanguage = "ja";
  initI18n({ resources: stringResources });

  //コンテンツのロードステートに移行
  const ua = navigator.userAgent;

  globals.gameStage.removeAllChildren();
  const text = new createjs.Text();
  setTextProperties(
    text,
    globals.gameScrean.width * 0.5,
    globals.gameScrean.height * 0.5,
    globals.gameScrean.width * 0.05,
    "Courier",
    "center",
    globals.gameScrean.width * 0.04
  );
  text.text = t(Ids.TAP_DISPLAY_INFO);

  globals.gameStage.addChild(text);
  globals.gameStage.update();

  window.addEventListener(pointerdown, start);
}

function start() {
  window.removeEventListener(pointerdown, start);

  loadContent().then(() => {
    to(TopEngine);
  });
}

window.addEventListener("load", init, {
  once: true
});
