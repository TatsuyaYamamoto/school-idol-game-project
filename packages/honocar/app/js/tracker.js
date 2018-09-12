const config = require("../../package.json").config.sokontokoro;

const trackingCode =
  process.env.NODE_ENV === "production"
    ? config.trackingCode.pro
    : config.trackingCode.dev;

export const TRACK_PAGES = {
  TOP: "/honocar/#top",
  MENU: "/honocar/#menu",
  HOW_TO_PLAY: "/honocar/#how_to_play",
  CREDIT: "/honocar/#credit",
  CHARA_SELECT: "/honocar/#chara_select",
  GAME: "/honocar/#game",
  GAME_ONLINE: "/honocar/#game_online"
};

export function tracePage(pagePath) {
  gtag("config", trackingCode, { page_path: pagePath });
}

export const TRACK_ACTION = {
  CLICK: "click",
  SELECT_CHARA: "select_chara"
};

export const TRACK_CATEGORY = {};

export const TRACK_LABEL = {};

export function trackClick(action, { category, label, value }) {
  const params = {};
  if (category) {
    params.event_category = category;
  }
  if (label) {
    params.event_label = label;
  }
  if (value) {
    params.value = value;
  }

  gtag("event", action, params);
}
