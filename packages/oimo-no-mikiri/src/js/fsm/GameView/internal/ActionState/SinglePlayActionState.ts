import * as Mousetrap from "mousetrap";

import ActionState, { EnterParams as ActionEnterParams } from "./ActionState";

import Actor from "../../../../models/Actor";
import { DisplayObject } from "pixi.js";

export interface EnterParams extends ActionEnterParams {
  autoOpponentAttackInterval: number;
}

class SinglePlayActionState extends ActionState {
  private _autoAttackTime: number;

  protected get autoAttackTime(): number {
    return this._autoAttackTime;
  }

  /**
   * @override
   */
  update(elapsedMS: number): void {
    super.update(elapsedMS);

    this.shouldSign() && this.onSignaled();

    this.shouldAutoAttack() && this.onAttacked(Actor.OPPONENT);
  }

  /**
   *
   * @param {EnterParams} params
   */
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    this._autoAttackTime =
      params.autoOpponentAttackInterval &&
      this.signalTime + params.autoOpponentAttackInterval;

    this.backGroundLayer.addChild(this.background);
    this.applicationLayer.addChild<DisplayObject>(
      this.oimo,
      this.player,
      this.opponent,
      this.playerFalseStartCheck,
      this.opponentFalseStartCheck,
      this.signalSprite
    );
  }

  /**
   * Return true if the opponent is NPC and it's time to attack automatically.
   *
   * @return {boolean}
   */
  protected shouldAutoAttack = (): boolean => {
    return (
      this.autoAttackTime &&
      !this.isAttacked(Actor.OPPONENT) &&
      this.autoAttackTime < this.elapsedTimeMillis
    );
  };

  /**
   * @override
   */
  bindKeyboardEvents() {
    Mousetrap.bind("a", () => {
      this.onAttacked(Actor.PLAYER);
    });
  }

  /**
   * @override
   */
  unbindKeyboardEvents() {
    Mousetrap.unbind("a");
  }

  /**
   *
   * @param e
   * @override
   */
  onWindowTaped(e: MouseEvent) {
    this.onAttacked(Actor.PLAYER);
  }
}

export default SinglePlayActionState;
