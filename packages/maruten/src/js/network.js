import request from "superagent";

import { ENDPOINT } from "./static/constant.js";
import properties from "./static/properties.js";
import State from "./state.js";

export default class Network {
  static getUser() {
    let isLoggedin = false;
    return new Promise((resolve, reject) => {
      request
        .get(ENDPOINT.USERS)
        .withCredentials()
        .end((err, res) => {
          if (!err && res.ok) {
            // response body格納
            State.user.id = res.body.user_id;
            State.user.name = res.body.user_name;
            properties.asyncImage.TWITTER_ICON.url = res.body.icon_url;

            // ログイン完了通知
            alertify.log("ランキングシステム ログイン中！", "success", 3000);

            // Promise response
            State.isLogin = true;
            resolve();
          } else {
            // Promise response
            State.isLogin = false;
            reject();
          }
        });
    });
  }

  static postScore(point) {
    request
      .post(ENDPOINT.SCORES)
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
      .post(ENDPOINT.PLAY_LOG)
      .withCredentials()
      .type("application/json")
      .send({ point: point })
      .end((err, res) => {
        /* ignore */
      });
  }
}
