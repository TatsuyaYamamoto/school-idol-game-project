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

export function postScore(point, member) {
  const url = config.api.score;
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
