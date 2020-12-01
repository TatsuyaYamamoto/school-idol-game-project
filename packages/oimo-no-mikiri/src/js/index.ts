import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

/**
 * @fileOverview Entry point of the application.
 */
import {
  config,
  initI18n,
  isSupportTouchEvent,
  initTracker,
  tracePage,
  initAuth,
} from "@sokontokoro/mikan";

import ApplicationState from "./fsm/ApplicationState";
import resources from "./resources/string";
import { init as initFirebase } from "./helper/firebase";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  BASIC_IMAGE_WIDTH,
  BASIC_IMAGE_HEIGHT,
} from "./Constants";

import { VirtualPageViews } from "./helper/tracker";

// Brand logo text font
require("../fonts/PixelMplus10-Regular.css");
require("../fonts/g_brushtappitsu_freeH.css");

// initialize firebase modules
initFirebase();
initAuth().then((user) => {
  initTracker(user.uid);
});

/**
 * Game rendering target on html.
 *
 * @type {HTMLElement}
 */
const mainElement: HTMLElement = document.getElementById("main");

/**
 * First gesture guide rendering target on html.
 *
 * @type {HTMLElement}
 * @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
 */
const firstGestureGuideElement: HTMLElement = document.getElementById(
  "first-gesture-guide"
);

/**
 * Application root instance.
 *
 * @type {ApplicationState}
 */
const app = new ApplicationState();

/**
 * Initialize the application.
 */
function init() {
  tracePage(VirtualPageViews.INITIAL);

  mainElement.style.display = "block";
  firstGestureGuideElement.style.display = "none";

  // set framework configuration
  config.supportedLanguages = Object.keys(SUPPORTED_LANGUAGES).map(
    (key) => SUPPORTED_LANGUAGES[key]
  );
  config.defaultLanguage = DEFAULT_LANGUAGE;
  config.basicImageWidth = BASIC_IMAGE_WIDTH;
  config.basicImageHeight = BASIC_IMAGE_HEIGHT;

  // Initialize internationalization.
  initI18n({ resources });

  // set application viewer.
  mainElement.appendChild(<HTMLElement>app.view);

  // start application.
  app.start();
}

// Fire init() on page loaded.
window.addEventListener(isSupportTouchEvent() ? "touchstart" : "click", init, {
  once: true,
});
