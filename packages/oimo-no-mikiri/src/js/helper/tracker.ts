/**
 * Tracking ViewPage paths
 *
 * @enum
 */

const basePath = `/oimo`;

export const VirtualPageViews = {
  INDEX: `${basePath}/#/`,
  INITIAL: `${basePath}/#/initial`,
  TITLE: `${basePath}/#/title`,
  MENU: `${basePath}/#/menu`,
  HOW_TO_USE: `${basePath}/#/how-to-use`,
  CREDIT: `${basePath}/#/credit`,
  GAME: `${basePath}/#/#game`,
  GAMEOVER: `${basePath}/#/gameover`
};

/**
 * Tracking categories.
 *
 * @enum
 */
export enum Category {
  BATTLE = "battle",
  ACHIEVEMENT = "achievement",
  BUTTON = "button",
  PERFORMANCE = "performance",
  JS_ERROR = "js_error"
}

/**
 * Tracking actions
 *
 * @enum
 */
export enum Action {
  TAP = "tap",
  SUCCESS_ATTACK = "success_attack",
  FALSE_START = "false_start",
  GAMEOVER = "gameover",
  LOSE = "lose"
}
