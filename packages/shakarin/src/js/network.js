import request from "superagent";

import { config, properties } from "./config.js";
import State from "./state.js";

export default class Network {
  static getUser() {
    return new Promise((resolve, reject) => {
      request
        .get(config.api.user)
        .withCredentials()
        .end((err, res) => {
          if (err || !res.ok) {
            State.isLogin = false;
            reject(err);
          } else {
            // ログイン完了通知
            alertify.log("ランキングシステム ログイン中！", "success", 3000);

            State.isLogin = true;

            // response body格納
            State.user.id = res.body.user_id;
            State.user.name = res.body.user_name;
            properties.asyncImage.TWITTER_ICON.url = res.body.icon_url;

            resolve();
          }
        });
    });
  }

  static postScore(point) {
    request
      .post(config.api.score)
      .withCredentials()
      .type("application/json")
      .send({ point: point })
      .end((err, res) => {
        if (res.ok) {
          alertify.log("ランキングシステム　通信完了！", "success", 3000);
        } else if (res.status == superagent.response.unauthorized) {
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

  static postPlayLog(point) {
    request
      .post(config.api.playlog)
      .withCredentials()
      .type("application/json")
      .send({ point: point })
      .end((err, res) => {
        /* ignore */
      });
  }
}
