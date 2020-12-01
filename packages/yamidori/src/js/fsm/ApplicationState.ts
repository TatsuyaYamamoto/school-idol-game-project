import Application from "../framework/Application";
import StateMachine from "../framework/StateMachine";
import { toggleMute } from "../framework/utils";
import { getCurrentViewSize, getScale } from "../framework/utils";

import { addEvents, removeEvents } from "../framework/EventUtils";
import InitialViewState from "./view/InitialViewState";
import LoadViewState from "./view/LoadViewState";
import TopViewState from "./view/TopViewState";
import GameViewState from "./view/GameViewState";

export enum Events {
  INITIALIZED = "ApplicationState@INITIALIZED",
  PRELOAD_COMPLETE = "ApplicationState@PRELOAD_COMPLETE",
  GAME_START_REQUEST = "ApplicationState@GAME_START_REQUEST",
  BACK_TO_TOP_REQUEST = "ApplicationState@BACK_TO_TOP_REQUEST",
}

class ApplicationState extends Application {
  private _viewStateMachine: StateMachine;
  private _initialViewState: InitialViewState;
  private _loadViewState: LoadViewState;
  private _topViewState: TopViewState;
  private _gameViewState: GameViewState;

  constructor() {
    super(getCurrentViewSize());
  }

  /**
   *
   * @param elapsedTime
   * @override
   */
  update(elapsedTime: number): void {
    this._viewStateMachine.update(elapsedTime);
  }

  /**
   * @override
   */
  onEnter(): void {
    this._updateRendererSize();
    this._updateStageScale();

    this._initialViewState = new InitialViewState();
    this._loadViewState = new LoadViewState();
    this._topViewState = new TopViewState();
    this._gameViewState = new GameViewState();

    this._viewStateMachine = new StateMachine({
      [InitialViewState.TAG]: this._initialViewState,
      [LoadViewState.TAG]: this._loadViewState,
      [TopViewState.TAG]: this._topViewState,
      [GameViewState.TAG]: this._gameViewState,
    });

    addEvents({
      [Events.INITIALIZED]: this._changeToLoadViewState,
      [Events.PRELOAD_COMPLETE]: this._changeToTopViewState,
      [Events.GAME_START_REQUEST]: this._changeToGameViewState,
      [Events.BACK_TO_TOP_REQUEST]: this._changeToTopViewState,
    });

    window.addEventListener("resize", this.onResize);
    window.addEventListener("blur", toggleMute);
    window.addEventListener("focus", toggleMute);

    this._viewStateMachine.init(InitialViewState.TAG);
    this.stage.addChild(this._initialViewState);
  }

  /**
   * @override
   */
  onExit(): void {
    removeEvents([
      Events.INITIALIZED,
      Events.PRELOAD_COMPLETE,
      Events.GAME_START_REQUEST,
      Events.BACK_TO_TOP_REQUEST,
    ]);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("blur", toggleMute);
    window.removeEventListener("focus", toggleMute);
  }

  private onResize = (event?: Event): void => {
    this._updateRendererSize();
    this._updateStageScale();
  };

  private _updateRendererSize = () => {
    const { width, height } = getCurrentViewSize();
    this.renderer.resize(width, height);
  };

  private _updateStageScale = () => {
    this.stage.scale.x = this.stage.scale.y = getScale();
  };

  private _changeToLoadViewState = () => {
    this._viewStateMachine.change(LoadViewState.TAG);
    this.stage.removeChildren();
    this.stage.addChild(this._loadViewState);
  };

  private _changeToTopViewState = () => {
    this._viewStateMachine.change(TopViewState.TAG);
    this.stage.removeChildren();
    this.stage.addChild(this._topViewState);
  };

  private _changeToGameViewState = () => {
    this._viewStateMachine.change(GameViewState.TAG);
    this.stage.removeChildren();
    this.stage.addChild(this._gameViewState);
  };
}

export default ApplicationState;
