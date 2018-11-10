import "alertify/themes/alertify.core.css";
import "alertify/themes/alertify.default.css";

import "createjs/builds/1.0.0/createjs.js";

import * as alertify from "alertify/lib/alertify";
import {
  config as mikanConfig,
  initI18n,
  isSupportTouchEvents,
  t,
  initAuth,
  tracePage,
  initTracker,
  Presence
} from "@sokontokoro/mikan";

import { to } from "./stateMachine";
import { initGameScreenScale } from "./common";
import { loadContent, soundTurnOff, soundTurnOn } from "./contentsLoader";
import TopEngine from "./engine/TopEngine";

import globals from "./globals";

import { default as config, TRACK_PAGES } from "./resources/config";
import { default as stringResources, Ids } from "./resources/string";

const rendererCanvas = document.createElement("canvas");
const appElement = document.getElementById("app");
const launchBeforeGuideElement = document.getElementById("launch-before-guide");
const gameLaunchButtonElement = document.getElementById("game-launch-button");

function init() {
  gameLaunchButtonElement.removeEventListener("click", init);

  // replace visible element
  // set 500ms timeout to show tap button animation
  setTimeout(() => {
    appElement.style.display = "block";
    launchBeforeGuideElement.style.display = "none";
  }, 150);

  /*---------- ログインチェック ----------*/
  globals.loginPromise = initAuth().then(user => {
    if (!user.isAnonymous) {
      alertify.log(t(Ids.LOGIN_SUCCESS), "success", 3000);
    }
    globals.loginUser = user;

    initTracker(user.uid);
    tracePage(TRACK_PAGES.INDEX);

    Presence.initWatch();
  });

  //ゲーム画面の初期
  appElement.appendChild(rendererCanvas);

  globals.gameStage = new createjs.Stage(rendererCanvas);
  globals.gameScrean = rendererCanvas;

  if (isSupportTouchEvents()) {
    createjs.Touch.enable(globals.gameStage, true, true);
  }

  //拡大縮小率の計算
  initGameScreenScale();

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

  loadContent().then(() => to(TopEngine));
}

gameLaunchButtonElement.addEventListener("click", init);
gameLaunchButtonElement.classList.remove(
  "launch-before-guide__button--initializing"
);
gameLaunchButtonElement.classList.add("launch-before-guide__button--ready");
