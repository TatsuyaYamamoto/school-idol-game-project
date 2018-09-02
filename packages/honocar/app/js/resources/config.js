const baseUrl =
  process.env.NODE_ENV === "production"
    ? "http://api.sokontokoro-factory.net/lovelive"
    : "http://api-dev.sokontokoro-factory.net/lovelive";

export default {
  system: {
    FPS: 30,
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
  api: {
    login: baseUrl + "/auth/twitter/login?redirect=honocar",
    logout: baseUrl + "/auth/twitter/logout/",
    score: baseUrl + "/scores/honocar/me/",
    playlog: baseUrl + "/scores/honocar/playlog/",
    user: baseUrl + "/users/me/"
  },
  link: {
    t28_twitter: "https://twitter.com/t28_tatsuya",
    sokontokoro: "http://sokontokoro-factory.net",
    sanzashi: "https://twitter.com/xxsanzashixx",
    soundeffect: "http://soundeffect-lab.info/",
    on_jin: "http://on-jin.com/"
  }
};
