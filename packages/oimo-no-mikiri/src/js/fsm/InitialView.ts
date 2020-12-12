import {
  dispatchEvent,
  ViewContainer,
  Deliverable,
  AssetLoader,
  resumeContext,
  tracePage,
  trackTiming,
  initAuth,
  initTracker,
  getLogger,
} from "@sokontokoro/mikan";

import { Events as ApplicationEvents } from "./ApplicationState";

import LoadingAnimationContainer from "../texture/containers/LoadingAnimationContainer";

import imageManifest from "../resources/image";
import soundManifest from "../resources/sound";

import { SKIP_BRAND_LOGO_ANIMATION } from "../Constants";

import { VirtualPageViews } from "../helper/tracker";
import { init as initFirebase } from "../helper/firebase";

const logger = getLogger("initial-view");

class InitialViewState extends ViewContainer {
  private _loader: AssetLoader;

  private _loadingAnimation: LoadingAnimationContainer;

  /**
   * @override
   */
  onEnter(params: Deliverable): void {
    super.onEnter(params);

    // Tracking
    tracePage(VirtualPageViews.INITIAL);

    logger.debug("start initializing.");

    Promise.all([
      this._startPreload(),
      this._startLoadAnimation(),
      this._login(),
      (async () => {
        // Resume AudioContext because Pixi-sound module starts before user's gesture.
        // @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
        await resumeContext();
        logger.debug("resume audio context");
      })(),
    ]).then(() => {
      logger.debug("end initializing.");
      dispatchEvent(ApplicationEvents.INITIALIZED);
    });
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();
  }

  /**
   *
   * @param {AssetLoader} event
   * @private
   */
  private _onLoadProgress = (event: AssetLoader): void => {
    const percentage = event.progress;
    this._loadingAnimation.progress(percentage);
  };

  private _startPreload = (): Promise<void> => {
    this._loader = new AssetLoader();
    this._loader.setImageManifest(imageManifest);
    this._loader.setSoundManifest(soundManifest);
    this._loader.onProgress.add(this._onLoadProgress);
    const loadStartTime = Date.now();

    return new Promise((resolve) => {
      this._loader.load(() => {
        this._trackPreloadPerformance(Date.now() - loadStartTime);

        logger.debug(`end preload`);
        resolve();
      });
    });
  };

  private _startLoadAnimation = async (): Promise<void> => {
    this._loadingAnimation = new LoadingAnimationContainer(
      this.viewWidth,
      this.viewHeight
    );
    this._loadingAnimation.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.5
    );

    this.applicationLayer.addChild(this._loadingAnimation);

    if (!SKIP_BRAND_LOGO_ANIMATION) {
      await this._loadingAnimation.start();
    }

    logger.debug(`end preload animation`);
  };

  private _login = async () => {
    // initialize firebase modules
    initFirebase();
    const user = await initAuth();
    initTracker(user.uid);

    logger.debug(`logged-in as ${user.uid}`);
  };

  private _trackPreloadPerformance = (timeMillis: number) => {
    trackTiming("preload_resources", timeMillis);
  };
}

export default InitialViewState;
