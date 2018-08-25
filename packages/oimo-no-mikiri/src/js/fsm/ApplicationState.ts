import { default as AutoBind } from "autobind-decorator";

import {
  Application,
  getCurrentViewSize,
  getScale,
  addEvents,
  removeEvents,
  toggleSound
} from "mikan";

import { default as InitialViewState } from "./InitialView";
import { EnterParams as GameViewEnterParams } from "./GameView/GameView";
import LocalGameView from "./GameView/LocalGameView";
import OnlineGameView from "./GameView/OnlineGameView";
import { default as TopViewState } from "./TopView";

import { isOnlineMode } from "../models/Game";

export enum Events {
  INITIALIZED = "ApplicationState@INITIALIZED",
  REQUESTED_GAME_START = "ApplicationState@REQUESTED_GAME_START",
  REQUESTED_BACK_TO_TOP = "ApplicationState@REQUESTED_BACK_TO_TOP"
}

enum InnerStates {
  INITIAL = "initial",
  TOP = "top",
  GAME = "game",
  ONLINE_GAME = "online_game"
}

@AutoBind
class ApplicationState extends Application {
  constructor() {
    const params = {
      ...getCurrentViewSize()
    };
    super(params);
  }

  /**
   * @override
   */
  update(elapsedTime: number): void {
    this.stateMachine.update(elapsedTime);
  }

  /**
   * @override
   */
  onEnter(): void {
    this.updateRendererSize();
    this.updateStageScale();

    // TODO create instance each changing state.
    this.stateMachine.set({
      [InnerStates.INITIAL]: new InitialViewState(),
      [InnerStates.TOP]: new TopViewState(),
      [InnerStates.GAME]: new LocalGameView(),
      [InnerStates.ONLINE_GAME]: new OnlineGameView()
    });

    addEvents({
      [Events.INITIALIZED]: this.handleInitializedEvent,
      [Events.REQUESTED_GAME_START]: this.handleRequestedGameStartEvent,
      [Events.REQUESTED_BACK_TO_TOP]: this.handleRequestedBackToTopEvent
    });

    window.addEventListener("resize", this.onResize);
    window.addEventListener("blur", this.turnSoundOff);
    window.addEventListener("focus", this.turnSoundOn);

    this.to(InnerStates.INITIAL);
  }

  /**
   * @override
   */
  onExit(): void {
    removeEvents([Events.INITIALIZED]);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("blur", this.turnSoundOff);
    window.removeEventListener("focus", this.turnSoundOn);
  }

  /**
   *
   */
  protected onResize(): void {
    this.updateRendererSize();
    this.updateStageScale();
  }

  /**
   *
   */
  private updateRendererSize() {
    const { width, height } = getCurrentViewSize();
    this.renderer.resize(width, height);
  }

  /**
   *
   */
  private updateStageScale() {
    this.stage.scale.x = this.stage.scale.y = getScale();
  }

  /**
   *
   */
  private handleInitializedEvent() {
    this.to(InnerStates.TOP);
  }

  /**
   *
   */
  private handleRequestedGameStartEvent(e: CustomEvent) {
    const { game } = e.detail;

    const nextState = isOnlineMode(game.mode)
      ? InnerStates.ONLINE_GAME
      : InnerStates.GAME;

    this.to<GameViewEnterParams>(nextState, { game });
  }

  /**
   *
   */
  private handleRequestedBackToTopEvent() {
    this.to(InnerStates.TOP);
  }

  private turnSoundOn() {
    toggleSound("on");
  }

  private turnSoundOff() {
    toggleSound("off");
  }
}

export default ApplicationState;
