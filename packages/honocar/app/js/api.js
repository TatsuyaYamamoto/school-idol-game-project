import config from "./resources/config";

// プレイログ・ランキングスコア登録-------------
export function postScore(passCarCount, member) {
  const url = config.api.score;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify({
    point: passCarCount,
    member: member
  });

  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers,
    body
  });
}

// システムへログイン-------------

export function requestLogin() {
  const url = config.api.user;

  return fetch(url, {
    mode: "cors",
    credentials: "include"
  });
}
