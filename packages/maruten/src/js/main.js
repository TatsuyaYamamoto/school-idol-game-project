import "alertify/themes/alertify.core.css";
import "alertify/themes/alertify.default.css";
import "createjs/builds/1.0.0/createjs.js";

import * as alertify from "alertify/lib/alertify";

import State from "./state.js";
import { STANDARD_PIXEL_SIZE } from "./static/config.js";
import StateMachine from "./stateMachine.js";
import Util from "./util.js";
import { getUser } from "./network.js";
import properties from "./static/properties";

window.onload = function() {
  /*---------- ログインチェック ----------*/
  // 完了後にコンテンツオブジェクトのセットアップを開始する
  State.deferredCheckLogin = getUser()
    .then(response => {
      if (response.ok) {
        State.isLogin = true;
        alertify.log("ランキングシステム ログイン中！", "success", 3000);

        return response.json().then(data => {
          State.user.id = data.user_id;
          State.user.name = data.user_name;
          properties.asyncImage.TWITTER_ICON.url = data.icon_url;
        });
      } else {
        throw "fail to login";
      }
    })
    .catch(e => {
      State.isLogin = false;
    });

  /*---------- ゲーム画面の初期化 ----------*/
  const scale = Util.initScreenScale(
    STANDARD_PIXEL_SIZE.HEIGHT,
    STANDARD_PIXEL_SIZE.WIDTH
  );
  const screenHeight = STANDARD_PIXEL_SIZE.HEIGHT * scale;
  const screenWidth = STANDARD_PIXEL_SIZE.WIDTH * scale;

  State.screenScale = scale;
  State.gameStage = new createjs.Stage("gameScrean");
  State.gameScrean = Util.getScreen("gameScrean", screenHeight, screenWidth);

  Util.showText(
    "booting up",
    State.gameScrean.width * 0.5,
    State.gameScrean.height * 0.5,
    State.gameScrean.width * 0.04,
    "Courier",
    "center"
  );

  /*---------- 基本設定 ----------*/

  //canvas要素内でのスマホでのスライドスクロール禁止
  // $(_gameScrean).on('touchmove.noScroll', function(e) {
  // 	e.preventDefault();
  // });

  //canvasステージ内でのタッチイベントの有効化
  if (createjs.Touch.isSupported()) {
    createjs.Touch.enable(State.gameStage);
  }

  // TODO createjsにcross originの画像を読み込まない
  createjs.DisplayObject.suppressCrossDomainErrors = true;

  // サウンド用イベント
  window.addEventListener("blur", function() {
    Util.soundTurnOff();
  });
  window.addEventListener("focus", function() {
    Util.soundTurnOn();
  });

  /*---------- StateMachien起動 ----------*/

  // iPhoneの場合、任意のイベントを実行前に音声を再生すると、音源が途切れる
  if (/(iPhone|iPad)/.test(navigator.userAgent)) {
    Util.removeAllChildren();
    Util.showText(
      "-Please tap on the display!-",
      State.gameScrean.width * 0.5,
      State.gameScrean.height * 0.5,
      State.gameScrean.width * 0.05,
      "Courier",
      "center"
    );

    window.addEventListener("touchstart", start);
  } else {
    // ログイン確認後ロード画面へ遷移
    StateMachine.instance().preloadState();
  }

  function start() {
    window.removeEventListener("touchstart", start);
    StateMachine.instance().preloadState();
  }
};
