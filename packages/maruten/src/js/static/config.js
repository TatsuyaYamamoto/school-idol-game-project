export const DEBUG = false;

export const FPS = 30;

export const STANDARD_PIXEL_SIZE = {
  WIDTH: 640,
  HEIGHT: 896
};

export const FEATHER_FLY_TIME_MILLIS = 700;

export const GAME_TIME_LENGTH_SECONDS = 20;

export const ADD_TIME_SECONDS_BY_ITEM = 4;

const basePath = `/maruten`;

export const TRACK_PAGES = {
  INDEX: `${basePath}`,
  TOP: `${basePath}#top`,
  MENU: `${basePath}#menu`,
  HOW_TO_PLAY: `${basePath}#how_to_play`,
  CREDIT: `${basePath}#credit`,
  GAME: `${basePath}#game`
};

export const TRACK_ACTION = {
  CLICK: "click",
  SELECT_CHARA: "select_chara",
  GAMEOVER: "gameover"
};
