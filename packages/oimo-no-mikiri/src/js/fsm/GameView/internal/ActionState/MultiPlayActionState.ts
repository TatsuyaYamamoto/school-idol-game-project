import * as Mousetrap from "mousetrap";

import { DisplayObject } from "pixi.js";
import ActionState, { EnterParams as ActionEnterParams } from "./ActionState";

import Actor from "../../../../models/Actor";
import BattleStatusBoard from "../../../../texture/containers/label/BattleStatusBoard";

export interface EnterParams extends ActionEnterParams {
  battleLeft: number;
  wins: { onePlayer: number; twoPlayer: number };
  isFalseStarted?: { player?: boolean; opponent?: boolean };
}

class MultiPlayActionState extends ActionState {
  private _battleStatusBoard: BattleStatusBoard;

  private _playerAttachAreaRange: number;

  protected get battleStatusBoard(): BattleStatusBoard {
    return this._battleStatusBoard;
  }

  protected get playerAttachAreaRange(): number {
    return this._playerAttachAreaRange;
  }

  /**
   * @override
   */
  update(elapsedMS: number): void {
    super.update(elapsedMS);

    if (this.shouldSign()) {
      this.onSignaled();
    }
  }

  /**
   *
   * @param {EnterParams} params
   */
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    this._playerAttachAreaRange = window.innerWidth / 2;

    this._battleStatusBoard = new BattleStatusBoard(
      this.viewWidth,
      this.viewHeight
    );
    this._battleStatusBoard.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.12
    );
    this._battleStatusBoard.battleLeft = params.battleLeft;
    this._battleStatusBoard.onePlayerWins = params.wins.onePlayer;
    this._battleStatusBoard.twoPlayerWins = params.wins.twoPlayer;

    this.backGroundLayer.addChild(this.background);
    this.applicationLayer.addChild<DisplayObject>(
      this.oimo,
      this.player,
      this.opponent,
      this.playerFalseStartCheck,
      this.opponentFalseStartCheck,
      this.signalSprite,
      this.battleStatusBoard
    );

    Mousetrap.bind("a", () => {
      this.onAttacked(Actor.PLAYER);
    });
    Mousetrap.bind("l", () => {
      this.onAttacked(Actor.OPPONENT);
    });
  }

  /**
   * @override
   */
  bindKeyboardEvents(): void {
    Mousetrap.bind("a", () => {
      this.onAttacked(Actor.PLAYER);
    });
    Mousetrap.bind("l", () => {
      this.onAttacked(Actor.OPPONENT);
    });
  }

  /**
   * @override
   */
  // eslint-disable-next-line
  unbindKeyboardEvents(): void {
    Mousetrap.unbind("a");
    Mousetrap.unbind("l");
  }

  /**
   *
   * @param e
   * @override
   */
  onWindowTaped(e: MouseEvent | TouchEvent): void {
    const position =
      e instanceof MouseEvent ? e.clientX : e.changedTouches.item(0).clientX;

    const attacker =
      position < this.playerAttachAreaRange ? Actor.PLAYER : Actor.OPPONENT;

    this.onAttacked(attacker);
  }
}

export default MultiPlayActionState;
