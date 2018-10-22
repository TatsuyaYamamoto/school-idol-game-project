import Mode from "./models/Mode";

/**
 * Parameters for game tuning.
 */
export const GAME_PARAMETERS = {
  /**
   * for tuning NPC's reaction rate.
   * {@link GAME_PARAMETERS.reaction_rate} according to original is too short for test player.
   */
  reaction_rate_tuning: 2.0,

  /**
   * NPC's reaction rate after turning action active.
   * These values' unit is in seconds.
   *
   * @see http://dic.nicovideo.jp/a/%E5%88%B9%E9%82%A3%E3%81%AE%E8%A6%8B%E6%96%AC%E3%82%8A
   */
  reaction_rate: {
    [Mode.SINGLE_BEGINNER]: {
      1: 81 / 60,
      2: 49 / 60,
      3: 20 / 60,
      4: 15 / 60,
      5: 10 / 60
    },
    [Mode.SINGLE_NOVICE]: {
      1: 62 / 60,
      2: 40 / 60,
      3: 16 / 60,
      4: 12 / 60,
      5: 9 / 60
    },
    [Mode.SINGLE_EXPERT]: {
      1: 17 / 60,
      2: 13 / 60,
      3: 11 / 60,
      4: 9 / 60,
      5: 7 / 60
    }
  },

  /**
   * Attack time distance time[ms] of player and opponent as draw.
   */
  acceptable_attack_time_distance: 17
};

/**
 * aspect ratio of the application container.
 *
 * @type {number}
 */
export const ASPECT_RATIO = 16 / 9;

/**
 * Basic width of the application view.
 * This app's assets is draw as premise of this.
 *
 * @type {number}
 */
export const BASIC_IMAGE_WIDTH = 800;

/**
 * Basic height of the application view.
 * This app's assets is draw as premise of this.
 * An alias to {@code BASIC_IMAGE_WIDTH / ASPECT_RATIO}.
 *
 * @type {number}
 */
export const BASIC_IMAGE_HEIGHT = BASIC_IMAGE_WIDTH / ASPECT_RATIO;

/**
 * Default round size of game.
 *
 * @type {number}
 */
export const DEFAULT_ROUND_SIZE = 5;

export const VIBRATE_TIME = {
  SIGNAL: 0,
  TRY_TO_ATTACK: 20,
  ATTACK: 100,
  FALSE_START: 20,
  DRAW: 100
};

/**
 * Skip ready state animation before game action if true.
 *
 * @type {boolean}
 */
export const SKIP_READY_ANIMATION = false;

/**
 * Skip brant logo animation on load view if true.
 *
 * @type {boolean}
 */
export const SKIP_BRAND_LOGO_ANIMATION = false;

/**
 * Supported languages.
 */
export const SUPPORTED_LANGUAGES = {
  EN: "en",
  JA: "ja"
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

/**
 * Application server base URL
 * @type {string}
 */
export const APP_SERVER_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.sokontokoro-factory.net/lovelive/"
    : "https://api.sokontokoro-factory.net/lovelive-test/";

/**
 * External URLs.
 */
export const URL = {
  OIMO_NO_MIKIRI: "https://games.sokontokoro-factory.net/oimo/",
  SOKONTOKORO_HOME: "https://www.sokontokoro-factory.net/",
  TWITTER_HOME_T28: "https://twitter.com/t28_tatsuya",
  TWITTER_HOME_SANZASHI: "https://twitter.com/xxsanzashixx",
  TWITTER_TWEET_PAGE: "https://twitter.com/intent/tweet",
  ONJIN_TOP: "https://on-jin.com/",
  LOVELIVE_TOP: "http://www.lovelive-anime.jp/",
  KIRBY_HOME: "https://www.nintendo.co.jp/n02/shvc/p_akfj/"
};

export const FIREBASE_OPTIONS =
  process.env.NODE_ENV === "production"
    ? {
        // Production config
        apiKey: "AIzaSyDvNopvc3Tr9WcfTUQK772aSmerv0UeRb0",
        authDomain: "oimo-no-mikiri.firebaseapp.com",
        databaseURL: "https://oimo-no-mikiri.firebaseio.com",
        projectId: "oimo-no-mikiri",
        storageBucket: "oimo-no-mikiri.appspot.com",
        messagingSenderId: "379161325988"
      }
    : {
        // Development config
        apiKey: "AIzaSyB16fI2MRL411jYOCjW1eL7hTuwOvlq3w8",
        databaseURL: "https://oimo-no-mikiri-development.firebaseio.com",
        storageBucket: "oimo-no-mikiri-development.appspot.com",
        authDomain: "oimo-no-mikiri-development.firebaseapp.com",
        messagingSenderId: "888607734391",
        projectId: "oimo-no-mikiri-development"
      };
