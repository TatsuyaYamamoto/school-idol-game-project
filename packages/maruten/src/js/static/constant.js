const apiServerOrigin = "http://api.sokontokoro-factory.net";
// const apiServerOrigin = "http://localhost:8888";
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
  SCORES: apiServerOrigin + contextPath + "/scores/maruten/me/",
  USERS: apiServerOrigin + contextPath + "/users/me/",
  PLAY_LOG: apiServerOrigin + contextPath + "/scores/maruten/playlog/"
};

export const LINK = {
  RANKING: "http://games.sokontokoro-factory.net/ranking/?game=maruten",
  T28_TWITTER: "https://twitter.com/t28_tatsuya",
  SOKONTOKORO_HOME: "http://sokontokoro-factory.net",
  SANZASHI_TWITTER: "https://twitter.com/xxsanzashixx",
  SOUNDEFFECT_HOME: "http://soundeffect-lab.info/",
  ONJIN_HOME: "http://on-jin.com/"
};
