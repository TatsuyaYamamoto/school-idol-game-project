const wwwAuthority =
  process.env.NODE_ENV === "production"
    ? "//www.sokontokoro-factory.net"
    : "//www-dev.sokontokoro-factory.net";

const gamesAuthority =
  process.env.NODE_ENV === "production"
    ? "//games.sokontokoro-factory.net"
    : "//games-dev.sokontokoro-factory.net";

export const CHARACTER = {
  HANAMARU: "hanamaru",
  YOU: "you"
};

export const LINK = {
  RANKING: `${gamesAuthority}/#/ranking/maruten`,
  SOKONTOKORO_HOME: `${wwwAuthority}/`,
  T28_TWITTER: "https://twitter.com/t28_tatsuya",
  SANZASHI_TWITTER: "https://twitter.com/xxsanzashixx",
  SOUNDEFFECT_HOME: "http://soundeffect-lab.info/",
  ONJIN_HOME: "http://on-jin.com/",
  LOVELIVE: "http://lovelive-anime.jp"
};
