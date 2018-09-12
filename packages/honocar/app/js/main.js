import "alertify/themes/alertify.core.css";
import "alertify/themes/alertify.default.css";

import "createjs/builds/1.0.0/createjs.js";

import "../main.css";

import * as alertify from "alertify/lib/alertify";
import {
  config as mikanConfig,
  initI18n,
  t,
  isSupportTouchEvent
} from "@sokontokoro/mikan";

import { to } from "./stateMachine";
import config from "./resources/config";
import { default as stringResources, Ids } from "./resources/string";
import { initGameScreenScale } from "./common";
import { requestLogin } from "./api";
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
  globals.loginPromise = requestLogin().then(response => {
    if (response.ok) {
      alertify.log(t(Ids.LOGIN_SUCCESS), "success", 3000);

      return response.json().then(data => {
        globals.isLogin = true;

        globals.user.id = data.user_id;
        globals.user.name = data.user_name;
        globals.user.iconUrl = data.icon_url;
      });
    } else {
      // 未ログインの場合は通知なし
      globals.isLogin = false;
    }
  });

  //ゲーム画面の初期
  globals.gameStage = new createjs.Stage("gameScrean");

  globals.gameScrean = document.getElementById("gameScrean");

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

  //canvasステージ内でのタッチイベントの有効化
  if (createjs.Touch.isSupported()) {
    createjs.Touch.enable(globals.gameStage);
  }

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

  if (/iPhone/.test(ua)) {
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

    window.addEventListener(
      isSupportTouchEvent() ? "touchstart" : "click",
      start
    );
  } else {
    // ログイン確認後ロード画面へ遷移
    loadContent().then(() => {
      to(TopEngine);
    });
  }
}

function start() {
  window.removeEventListener(
    isSupportTouchEvent() ? "touchstart" : "click",
    start
  );
  loadContent().then(() => {
    to(TopEngine);
  });
}

window.addEventListener("load", init, {
  once: true
});
