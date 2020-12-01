/**
 * Parameters for game tuning.
 */
export const GAME_PARAMETERS = {
  /**
   * Coefficient of Kotori speed in 1/second.
   * A distance of Kotori's moving in pixel/second can be calculated with the following.
   * screen width[pixel] * elapsedTime[sec.] * this coefficient.
   */
  KOTORI_SPEED_HIGH: 0.00065,

  /**
   * @see GAME_PARAMETERS.KOTORI_SPEED_HIGH
   */
  KOTORI_SPEED_MIDDLE: 0.00055,

  /**
   * @see GAME_PARAMETERS.KOTORI_SPEED_HIGH
   */
  KOTORI_SPEED_LOW: 0.00045,

  /**
   * Min interval time [milliseconds] that Kotori is appearing.
   */
  KOTORI_APPEARANCE_INTERVAL_MIN: 200,

  /**
   * @see GAME_PARAMETERS.KOTORI_APPEARANCE_INTERVAL_MIN
   */
  KOTORI_APPEARANCE_INTERVAL_MAX: 2000,
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
 * Skip game count state on game view if true.
 *
 * @type {boolean}
 */
export const SKIP_COUNT_DOWN_FOR_GAME_START = false;

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
  JA: "ja",
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

const wwwOrigin =
  process.env.NODE_ENV === "production"
    ? "https://www.sokontokoro-factory.net"
    : "https://www-dev.sokontokoro-factory.net";

const gamesOrigin =
  process.env.NODE_ENV === "production"
    ? "https://games.sokontokoro-factory.net"
    : "https://games-dev.sokontokoro-factory.net";

/**
 * External URLs.
 */
export const URL = {
  YAMIDORI: `${gamesOrigin}/yamidori/`,
  SOKONTOKORO_HOME: `${wwwOrigin}`,
  TWITTER_HOME_T28: "https://twitter.com/t28_tatsuya",
  TWITTER_HOME_SANZASHI: "https://twitter.com/xxsanzashixx",
  TWITTER_TWEET_PAGE: "https://twitter.com/intent/tweet",
  ONJIN_TOP: "https://on-jin.com/",
  LOVELIVE_TOP: "http://www.lovelive-anime.jp/",
};
