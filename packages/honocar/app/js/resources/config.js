const wwwAuthority =
  process.env.NODE_ENV === "production"
    ? "//www.sokontokoro-factory.net"
    : "//www-dev.sokontokoro-factory.net";

const gamesAuthority =
  process.env.NODE_ENV === "production"
    ? "//games.sokontokoro-factory.net"
    : "//games-dev.sokontokoro-factory.net";

export default {
  system: {
    framerate: 30,
    gamescrean: {
      width: 640,
      height: 896
    },
    car: {
      width: 135,
      height: 169,
      fasterSpeed: 1600,
      slowerSpeed: 2000
    },
    anime: {
      registrationFeedTime: 500
    },
    difficultyLength: 0.3
  },
  link: {
    game: `https:${gamesAuthority}/honocar`,
    homepage: `${wwwAuthority}/`,
    ranking: `${gamesAuthority}/#/ranking/honocar`,
    t28_twitter: "https://twitter.com/t28_tatsuya",
    sokontokoro: "http://sokontokoro-factory.net",
    sanzashi: "https://twitter.com/xxsanzashixx",
    soundeffect: "http://soundeffect-lab.info/",
    on_jin: "http://on-jin.com/",
    lovelive: "http://www.lovelive-anime.jp/"
  }
};

const basePath = `/honocar`;

export const TRACK_PAGES = {
  INDEX: `${basePath}/`,
  TOP: `${basePath}/#/top`,
  MENU: `${basePath}/#/menu`,
  HOW_TO_PLAY: `${basePath}/#/how_to_play`,
  CREDIT: `${basePath}#/credit`,
  CHARA_SELECT: `${basePath}/#/chara_select`,
  GAME: `${basePath}/#/game`,
  GAMEOVER: `${basePath}/#/gameover`,
  GAME_ONLINE: `${basePath}/#/game_online`,
  GAMEOVER_ONLINE: `${basePath}/#/gameover_online`
};

export const TRACK_ACTION = {
  CLICK: "click",
  SELECT_CHARA: "select_chara",
  GAMEOVER: "gameover"
};
