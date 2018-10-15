const apiServerOrigin =
  process.env.NODE_ENV === "production"
    ? "//api.sokontokoro-factory.net"
    : "//api-dev.sokontokoro-factory.net";
const contextPath = "/lovelive";

export const CHARACTER = {
  HANAMARU: "hanamaru",
  YOU: "you"
};

export const LINK = {
  RANKING:
    process.env.NODE_ENV === "production"
      ? "//games.sokontokoro-factory.net/#/ranking/maruten"
      : "//games-dev.sokontokoro-factory.net/#/ranking/maruten",
  SOKONTOKORO_HOME: "https://www.sokontokoro-factory.net",
  T28_TWITTER: "https://twitter.com/t28_tatsuya",
  SANZASHI_TWITTER: "https://twitter.com/xxsanzashixx",
  SOUNDEFFECT_HOME: "http://soundeffect-lab.info/",
  ONJIN_HOME: "http://on-jin.com/"
};
