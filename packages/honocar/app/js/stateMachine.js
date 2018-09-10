import { parse } from "query-string";
import {
  P2PClient,
  getLogger,
  openModal,
  closeModal,
  getCurrentUrl
} from "@sokontokoro/mikan";

import TopEngine from "./engine/TopEngine";

import { postPlayLog, registration } from "./api";
import { loadContent } from "./contentsLoader";
import globals from "./globals";
import { P2PEvents } from "./constants";
import { trySyncGameStart } from "./common";
import OnlineGameEngine from "./engine/OnlineGameEngine";

const logger = getLogger("state-machine");

let currentState = null;

export function to(stateEngine, params) {
  const nextState = stateEngine;
  const prevState = currentState;

  prevState && prevState["tearDown"]();
  nextState && nextState["init"](params);

  currentState = nextState;
}
