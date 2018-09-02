import $ from "jquery";
import "alertify/lib/alertify";
import "alertify/themes/alertify.core.css";
import "alertify/themes/alertify.default.css";
import "../main.css";

import { loadState } from "./stateMachine";
import { requestCheckingLogging, initGameScreenScale } from "./common";
import { setTextProperties } from "./contentsLoader";
import config from "./resources/config";
import globals from "./globals";

function init() {
  /*---------- ログインチェック ----------*/
  // 完了後にコンテンツオブジェクトのセットアップを開始する
  globals.deferredCheckLogin = requestCheckingLogging();

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

  //canvas要素内でのスマホでのスライドスクロール禁止
  $(gameScrean).on("touchmove.noScroll", function(e) {
    e.preventDefault();
  });

  //canvasステージ内でのタッチイベントの有効化
  if (createjs.Touch.isSupported()) {
    createjs.Touch.enable(globals.gameStage);
  }

  //ゲーム用タイマーの設定
  createjs.Ticker.setFPS(config.system.FPS);
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

  // TODO createjsにcross originの画像を読み込まない
  createjs.DisplayObject.suppressCrossDomainErrors = true;

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
    text.text = "-Please tap on the display!-";

    globals.gameStage.addChild(text);
    globals.gameStage.update();

    window.addEventListener("touchstart", start);
  } else {
    // ログイン確認後ロード画面へ遷移
    loadState();
  }
}

function start() {
  window.removeEventListener("touchstart", start);
  loadState();
}

window.addEventListener("load", init, {
  once: true
});
