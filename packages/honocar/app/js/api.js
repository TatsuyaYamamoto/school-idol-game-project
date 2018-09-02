import config from "./resources/config";
import properties from "./resources/object-props";
import globals from "./globals";

// プレイログ登録-------------
export function postPlayLog() {
  const url = config.api.playlog;
  const headers = {
    "Content-Type": "application/json"
  };

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      point: globals.passCarCount
    })
  });
}

// ランキング登録-------------
export function registration() {
  const url = config.api.score;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify({
    point: globals.passCarCount
  });

  return fetch(url, {
    method: "POST",
    headers,
    body
  }).then(response => {
    if (response.ok) {
      alertify.log("ランキングシステム　通信完了！", "success", 3000);
      return;
    }

    if (response.status === 401) {
      alertify.log(
        "ログインセッションが切れてしまいました...再ログインして下さい。",
        "error",
        3000
      );
    } else {
      alertify.log(
        "ランキングシステムへの接続に失敗しました...",
        "error",
        3000
      );
    }
  });
}

// システムへログイン-------------

export function requestLogin() {
  const url = config.api.user;

  return fetch(url, {}).then(response => {
    if (response.ok) {
      alertify.log("ランキングシステム ログイン中！", "success", 3000);

      globals.user.id = data.user_id;
      globals.user.name = data.user_name;
      properties.asyncImage.TWITTER_ICON.url = data.icon_url;

      globals.isLogin = true;
    } else {
      // 未ログインの場合は通知なし
      globals.isLogin = false;
    }
  });
}
