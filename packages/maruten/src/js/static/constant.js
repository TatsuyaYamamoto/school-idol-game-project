const apiServerOrigin =
  process.env.NODE_ENV === "production"
    ? "//api.sokontokoro-factory.net"
    : "//api-dev.sokontokoro-factory.net";
const contextPath = "/lovelive";

export const CHARACTER = {
  HANAMARU: "hanamaru",
  YOU: "you"
};

export const ENDPOINT = {
  LOGIN:
    apiServerOrigin + contextPath + "/auth/twitter/login/?redirect=maruten",
  LOGOUT:
    apiServerOrigin + contextPath + "/auth/twitter/logout/?redirect=maruten",
  SCORES: apiServerOrigin + contextPath + "/games/maruten/scores/",
  USERS: apiServerOrigin + contextPath + "/users/me/"
};

export const LINK = {
  RANKING: "http://games.sokontokoro-factory.net/ranking/?game=maruten",
  T28_TWITTER: "https://twitter.com/t28_tatsuya",
  SOKONTOKORO_HOME: "http://sokontokoro-factory.net",
  SANZASHI_TWITTER: "https://twitter.com/xxsanzashixx",
  SOUNDEFFECT_HOME: "http://soundeffect-lab.info/",
  ONJIN_HOME: "http://on-jin.com/"
};
