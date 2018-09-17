import { ENDPOINT } from "./static/constant.js";

export function getUser() {
  const url = ENDPOINT.USERS;
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

export function postScore(point, member) {
  const url = ENDPOINT.SCORES;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify({
    point,
    member
  });

  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers,
    body
  });
}
