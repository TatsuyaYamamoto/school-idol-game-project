import StateMachine from "../../framework/StateMachine";
import { addEvents, removeEvents } from "../../framework/EventUtils";

import CountGameState from "../section/game/CountGameState";
import OverGameState from "../section/game/OverGameState";
import PlayingGameState from "../section/game/PlayingGameState";

import ViewContainer from "../../framework/ViewContainer";
import Background from "../../container/sprite/background/Background";

import { SKIP_COUNT_DOWN_FOR_GAME_START } from "../../Constants";

export enum Events {
  COUNT_START = "GameViewState@COUNT_START",
  GAME_START = "GameViewState@GAME_START",
  GAME_OVER = "GameViewState@GAME_OVER",
  TAP_KOTORI = "GameViewState@TAP_KOTORI"
}

class GameViewState extends ViewContainer {
  public static TAG = "GameViewState";

  private _gameStateMachine: StateMachine;
  private _countGameState: CountGameState;
  private _overGameState: OverGameState;
  private _playingGameState: PlayingGameState;

  private _gameBackground: Background;

  private _gamePoint: number;

  update(elapsedTime: number): void {
    super.update(elapsedTime);

    this._gameStateMachine.update(elapsedTime);
  }

  onEnter(): void {
    super.onEnter();

    this._countGameState = new CountGameState();
    this._overGameState = new OverGameState();
    this._playingGameState = new PlayingGameState();

    this._gameStateMachine = new StateMachine({
      [CountGameState.TAG]: this._countGameState,
      [OverGameState.TAG]: this._overGameState,
      [PlayingGameState.TAG]: this._playingGameState
    });

    addEvents({
      [Events.COUNT_START]: this._changeToCountState,
      [Events.GAME_START]: this._changeToPlayingGameState,
      [Events.GAME_OVER]: this._changeToOverGameState,
      [Events.TAP_KOTORI]: this._incrementGamePoint
    });

    this._gameStateMachine.init(CountGameState.TAG);

    this._gamePoint = 0;

    this._gameBackground = new Background();

    this.backGroundLayer.addChild(this._gameBackground);
    this.applicationLayer.addChild(this._countGameState);

    if (SKIP_COUNT_DOWN_FOR_GAME_START) {
      this._changeToPlayingGameState();
    }
  }

  onExit(): void {
    super.onExit();

    removeEvents([
      Events.COUNT_START,
      Events.GAME_START,
      Events.GAME_OVER,
      Events.TAP_KOTORI
    ]);
  }

  private _changeToCountState = (): void => {};

  private _changeToPlayingGameState = (): void => {
    this._gameStateMachine.change(PlayingGameState.TAG);
    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this._playingGameState);
  };

  private _changeToOverGameState = (): void => {
    this._gameStateMachine.change(OverGameState.TAG);
    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this._overGameState);
  };

  private _incrementGamePoint = (): void => {
    this._gamePoint++;
  };
}

export default GameViewState;
