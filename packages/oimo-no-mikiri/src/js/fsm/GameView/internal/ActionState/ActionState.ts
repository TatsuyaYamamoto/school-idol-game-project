import { Deliverable, vibrate, play, dispatchEvent } from "@sokontokoro/mikan";

import GameViewState from "../GameViewState";
import { Events } from "../../GameView";

import Signal from "../../../../texture/sprite/Signal";
import FalseStartCheck from "../../../../texture/sprite/text/FalseStartCheck";

import Actor from "../../../../models/Actor";

import { VIBRATE_TIME } from "../../../../Constants";

import { Ids as SoundIds } from "../../../../resources/sound";

export interface EnterParams extends Deliverable {
  signalTime: number;
  isFalseStarted?: { player?: boolean; opponent?: boolean };
}

abstract class ActionState extends GameViewState {
  private _signalTime: number;
  private _isSignaled: boolean;
  private _attackTimeMap: Map<Actor, number>;

  private _signalSprite: Signal;
  private _playerFalseStartCheck: FalseStartCheck;
  private _opponentFalseStartCheck: FalseStartCheck;

  protected get signalTime(): number {
    return this._signalTime;
  }

  constructor(params) {
    super(params);

    // Bind this instance to class' abstract methods that can't define as bind property.
    this.bindKeyboardEvents = this.bindKeyboardEvents.bind(this);
    this.unbindKeyboardEvents = this.unbindKeyboardEvents.bind(this);
    this.onWindowTaped = this.onWindowTaped.bind(this);
  }

  /**
   * Return true if the battle is already signed.
   *
   * @return {boolean}
   */
  protected get isSignaled(): boolean {
    return this._isSignaled;
  }

  protected get signalSprite(): Signal {
    return this._signalSprite;
  }

  protected get playerFalseStartCheck(): FalseStartCheck {
    return this._playerFalseStartCheck;
  }

  protected get opponentFalseStartCheck(): FalseStartCheck {
    return this._opponentFalseStartCheck;
  }

  /**
   * @override
   */
  onEnter(params: EnterParams): void {
    super.onEnter(params);
    const { signalTime, isFalseStarted } = params;

    this._signalTime = signalTime;
    this._isSignaled = false;
    this._attackTimeMap = new Map();

    this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
    this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
    this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

    this._signalSprite = new Signal();
    this._signalSprite.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.4
    );
    this._signalSprite.hide();

    this._playerFalseStartCheck = new FalseStartCheck();
    this._playerFalseStartCheck.position.set(
      this.viewWidth * 0.1,
      this.viewHeight * 0.3
    );
    this._playerFalseStartCheck.visible =
      isFalseStarted && isFalseStarted.player;

    this._opponentFalseStartCheck = new FalseStartCheck();
    this._opponentFalseStartCheck.position.set(
      this.viewWidth * 0.9,
      this.viewHeight * 0.3
    );
    this._opponentFalseStartCheck.visible =
      isFalseStarted && isFalseStarted.opponent;

    this.bindKeyboardEvents();
    this.addClickWindowEventListener(this.onWindowTaped);
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();

    this.unbindKeyboardEvents();
    this.removeClickWindowEventListener(this.onWindowTaped);
  }

  abstract bindKeyboardEvents(): void;

  abstract unbindKeyboardEvents(): void;

  abstract onWindowTaped(e: MouseEvent | TouchEvent): void;

  /**
   * Fired when attack of the battle is available.
   */
  protected onSignaled = () => {
    console.log("Signaled!");

    this._isSignaled = true;
    this._signalSprite.show();

    play(SoundIds.SOUND_HARISEN);
    vibrate(VIBRATE_TIME.SIGNAL);
  };

  /**
   * Fired when provided actor requests to attack.
   *
   * @param {Actor} actor
   */
  protected onAttacked = (actor: Actor): void => {
    if (this.isAttacked(actor)) {
      return;
    }

    const attackTime = this.elapsedTimeMillis - this.signalTime;
    this._attackTimeMap.set(actor, attackTime);

    dispatchEvent(Events.ATTACK, {
      attackTime,
      attacker: actor
    });
  };

  /**
   * Return true if player and opponent' attack is available.
   *
   * @return {boolean}
   */
  protected shouldSign = (): boolean => {
    return !this.isSignaled && this.signalTime < this.elapsedTimeMillis;
  };

  /**
   * Return true if provided actor already attacked.
   *
   * @param {Actor} actor
   * @return {boolean}
   */
  protected isAttacked = (actor: Actor): boolean => {
    return !!this._attackTimeMap.get(actor);
  };
}

export default ActionState;
