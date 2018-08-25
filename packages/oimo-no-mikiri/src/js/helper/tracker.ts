/**
 * @fileOverview GA Tracker convenience methods
 *
 * Before fire any tracking functions, you should call {@link init}.
 */

/**
 * Initialize GA tracker with provided tracking ID.
 *
 * @param accountId
 */
// tslint:disable:no-parameter-reassignment
export function init(accountId) {
  console.log(
    `Initialize GA tracker. AccountID: ${accountId}, location path: ${
      location.pathname
    }`
  );

  (function(i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * <any>new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics.js",
    "ga"
  );

  ga("create", accountId, "auto");
  ga("send", "pageview");
}
// tslint:enable:no-parameter-reassignment

/**
 * Tracking ViewPage paths
 *
 * @enum
 */
export enum VirtualPageViews {
  INITIAL = "#initial",
  TITLE = "#title",
  MENU = "#menu",
  HOW_TO_USE = "#how-to-use",
  CREDIT = "#credit",
  GAME = "#game"
}

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
  COMPLETE_ALL_ROUNDS = "complete",
  LOSE = "lose"
}

/**
 * Tracking variables for timing.
 *
 * @enum
 */
export enum TimingVariable {
  LOAD = "load"
}

/**
 * Send page view tracking.
 *
 * @param {VirtualPageViews} path
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages?hl=ja
 */
export function trackPageView(path: VirtualPageViews): void {
  ga("set", "page", `${location.pathname}${path}`);
  ga("send", "pageview");
}

/**
 * Send event tracking.
 *
 * @param {Category} category
 * @param {Action} action
 * @param {string} label
 * @param {number} value
 */
export function trackEvent(
  category: Category,
  action: string,
  label?: string,
  value?: number
): void {
  if (!!value && !Number.isInteger(value)) {
    console.error("GA event value is supporting to integer only.");
    return;
  }
  ga("send", {
    hitType: "event",
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value
  });
}

/**
 * Send error tracking.
 *
 * @param {Error} err
 */
export function trackError(err: Error): void {
  ga("send", {
    hitType: "event",
    eventCategory: Category.JS_ERROR,
    eventAction: err.message,
    eventLabel: err.stack
  });
}

/**
 * Send timing tracking.
 *
 *
 * @param {Category} category
 * @param {TimingVariable} variable
 * @param {number} time
 * @param {string} label
 */
export function trackTiming(
  category: Category,
  variable: TimingVariable,
  time: number,
  label?: string
): void {
  if (!Number.isInteger(time)) {
    console.error("GA event value is supporting to integer only.");
    return;
  }

  ga("send", "timing", {
    timingCategory: category,
    timingVar: variable,
    timingValue: time,
    timingLabel: label
  });
}
