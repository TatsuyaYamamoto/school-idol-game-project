import * as alertify from "alertify/lib/alertify";
import { t } from "@sokontokoro/mikan";

import config from "./resources/config";
import { Ids } from "./resources/string";
import globals from "./globals";

// プレイログ登録-------------
export function postPlayLog(passCarCount) {
  const url = config.api.playlog;
  const headers = {
    "Content-Type": "application/json"
  };

  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers,
    body: JSON.stringify({
      point: passCarCount
    })
  });
}

// ランキング登録-------------
export function registration(passCarCount) {
  const url = config.api.score;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify({
    point: passCarCount
  });

  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers,
    body
  }).then(response => {
    if (response.ok) {
      alertify.log(t(Ids.REGISTER_SUCCESS), "success", 3000);
      return;
    }

    if (response.status === 401) {
      alertify.log(t(Ids.UNAUTHORIZED), "error", 3000);
    } else {
      alertify.log(t(Ids.UNEXPECTED_SERVER_ERROR), "error", 3000);
    }
  });
}

// システムへログイン-------------

export function requestLogin() {
  const url = config.api.user;

  return fetch(url, {
    mode: "cors",
    credentials: "include"
  }).then(response => {
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
}
