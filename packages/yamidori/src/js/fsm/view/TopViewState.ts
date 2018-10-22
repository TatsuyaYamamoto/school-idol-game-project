import Sound from "pixi-sound/lib/Sound";

import TitleTopState from "../section/top/TitleTopState";
import CreditTopState from "../section/top/CreditTopState";
import UsageTopState from "../section/top/UsageTopState";
import MenuTopState from "../section/top/MenuTopState";

import ViewContainer from "../../framework/ViewContainer";
import Background from "../../container/sprite/background/Background";

import { Ids } from "../../resources/sound";
import { loadSound } from "../../framework/AssetLoader";
import StateMachine from "../../framework/StateMachine";

import { Events as ApplicationEvents } from "../ApplicationState";
import {
  dispatchEvent,
  addEvents,
  removeEvents
} from "../../framework/EventUtils";

export enum Events {
  REQUEST_GAME_START = "GameViewState@REQUEST_GAME_START",
  REQUEST_GO_TO_MENU = "GameViewState@REQUEST_GO_TO_MENU",
  REQUEST_GO_TO_USAGE = "GameViewState@REQUEST_GO_TO_USAGE",
  REQUEST_GO_TO_CREDIT = "GameViewState@REQUEST_GO_TO_CREDIT",
  REQUEST_BACK_TO_TOP = "TopViewState@REQUEST_BACK_TO_TOP"
}

class TopViewState extends ViewContainer {
  public static TAG = "TopViewState";

  private _topViewStateMachine: StateMachine;
  private _titleTopState: TitleTopState;
  private _menuTopState: MenuTopState;
  private _creditTopState: CreditTopState;
  private _usageTopState: UsageTopState;

  private _background: Background;

  private _zenkaiSound: Sound;

  /**
   * @inheritDoc
   */
  update(elapsedTime: number): void {
    this._topViewStateMachine.update(elapsedTime);
  }

  /**
   * @inheritDoc
   */
  onEnter(): void {
    super.onEnter();

    this._titleTopState = new TitleTopState();
    this._menuTopState = new MenuTopState();
    this._creditTopState = new CreditTopState();
    this._usageTopState = new UsageTopState();

    this._topViewStateMachine = new StateMachine({
      [TitleTopState.TAG]: this._titleTopState,
      [MenuTopState.TAG]: this._menuTopState,
      [CreditTopState.TAG]: this._creditTopState,
      [UsageTopState.TAG]: this._usageTopState
    });

    addEvents({
      [Events.REQUEST_GO_TO_MENU]: this._changeToMenuTopState,
      [Events.REQUEST_GAME_START]: this._requestGameStart,
      [Events.REQUEST_GO_TO_USAGE]: this._changeToUsageState,
      [Events.REQUEST_GO_TO_CREDIT]: this._changeToCredit,
      [Events.REQUEST_BACK_TO_TOP]: this._changeToMenuTopState
    });

    this._zenkaiSound = loadSound(Ids.SOUND_ZENKAI);
    this._zenkaiSound.play({ loop: true });

    this._topViewStateMachine.init(TitleTopState.TAG);

    this._background = new Background();

    this.backGroundLayer.addChild(this._background);
    this.applicationLayer.addChild(this._titleTopState);
  }

  /**
   * @inheritDoc
   */
  onExit(): void {
    super.onEnter();

    this._zenkaiSound.stop();
    removeEvents([
      Events.REQUEST_GO_TO_MENU,
      Events.REQUEST_GAME_START,
      Events.REQUEST_GO_TO_USAGE,
      Events.REQUEST_GO_TO_CREDIT,
      Events.REQUEST_BACK_TO_TOP
    ]);
  }

  private _requestGameStart = (): void => {
    dispatchEvent(ApplicationEvents.GAME_START_REQUEST);
  };

  private _changeToMenuTopState = (): void => {
    this._topViewStateMachine.change(MenuTopState.TAG);

    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this._menuTopState);
  };

  private _changeToUsageState = (): void => {
    this._topViewStateMachine.change(UsageTopState.TAG);

    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this._usageTopState);
  };

  private _changeToCredit = (): void => {
    this._topViewStateMachine.change(CreditTopState.TAG);

    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this._creditTopState);
  };
}

export default TopViewState;
