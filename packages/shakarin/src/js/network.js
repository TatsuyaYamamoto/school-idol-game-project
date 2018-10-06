import { config, properties } from "./config.js";
import State from "./state.js";

export function getUser() {
  const url = config.api.user;
  const headers = {
    "Content-Type": "application/json"
  };

  return fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers
  });
}

export default class Network {
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
