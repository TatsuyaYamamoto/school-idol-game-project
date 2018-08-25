import { filters } from "pixi.js";
import * as anime from "animejs";

import Deliverable from "../../../../framework/Deliverable";
import { dispatchEvent } from "../../../../framework/EventUtils";

import { Events } from "../GameView";
import GameViewState from "./GameViewState";

import BattleResultLabel from "../../../texture/containers/BattleResultLabel";
import Character from "../../../texture/sprite/character/Character";

import Actor from "../../../models/Actor";

export interface EnterParams extends Deliverable {
  winner?: Actor;
  falseStarter?: Actor;
}

class ResultState extends GameViewState {
  private _battleResultLabelBoard: BattleResultLabel;

  protected _hueFilter: filters.ColorMatrixFilter;
  protected _brightnessFilter: filters.ColorMatrixFilter;

  /**
   * @override
   */
  onEnter(params: EnterParams = {}): void {
    super.onEnter(params);

    this.player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);
    this.opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
    this.oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

    const type = params.winner
      ? params.winner === Actor.PLAYER
        ? "playerWin"
        : "opponentWin"
      : params.falseStarter
        ? "falseStart"
        : "draw";
    const name = params.winner
      ? params.winner === Actor.PLAYER
        ? this.player.name
        : this.opponent.name
      : null;
    this._battleResultLabelBoard = new BattleResultLabel(
      this.viewWidth,
      this.viewHeight,
      type,
      name
    );
    this._battleResultLabelBoard.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.5
    );

    this._hueFilter = new filters.ColorMatrixFilter();
    this._brightnessFilter = new filters.ColorMatrixFilter();
    this.background.filters = [this._hueFilter, this._brightnessFilter];

    this.whiteLayer.alpha = 0;

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this.player,
      this.opponent,
      this.oimo,
      this.whiteLayer
    );

    if (params.falseStarter) {
      this.showFalseStart();
      return;
    }

    if (params.winner === Actor.PLAYER) {
      this.showPlayerWon();
      return;
    }

    if (params.winner === Actor.OPPONENT) {
      this.showOpponentWon();
      return;
    }

    this.showDraw();
  }

  private showPlayerWon(): void {
    this.whiteOut(
      () => {
        this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this.oimo.visible = false;

        this.player.playSuccessAttack();
        this.opponent.playTryAttack();
      },
      () => {
        this.player.playWin();
        this.opponent.playLose();

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
      }
    );
  }

  private showOpponentWon(): void {
    this.whiteOut(
      () => {
        this.player.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);
        this.opponent.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

        this.oimo.visible = false;

        this.player.playTryAttack();
        this.opponent.playSuccessAttack();
      },
      () => {
        this.player.playLose();
        this.opponent.playWin();

        this.applicationLayer.addChild(this._battleResultLabelBoard);

        setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
      }
    );
  }

  private showDraw(): void {
    this.applicationLayer.addChild(this._battleResultLabelBoard);

    Promise.all([this.vibrate(this.player), this.vibrate(this.opponent)]).then(
      () => {
        setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
      }
    );
  }

  private showFalseStart(): void {
    this._hueFilter.hue(180);
    this._brightnessFilter.brightness(0.5);

    this.applicationLayer.addChild(this._battleResultLabelBoard);

    setTimeout(() => dispatchEvent(Events.REQUEST_READY), 3000);
  }

  protected vibrate = (target: Character): Promise<void> => {
    const center = target.position.x;
    const right = target.position.x + this.viewWidth * 0.005;
    const left = target.position.x - this.viewWidth * 0.005;
    const periodTimeMillis = 100;

    const timeLine = anime.timeline({
      targets: target.position,
      easing: "linear",
      loop: 3
    });

    timeLine
      .add({ x: right, duration: periodTimeMillis / 4 })
      .add({ x: center, duration: periodTimeMillis / 4 })
      .add({ x: left, duration: periodTimeMillis / 4 })
      .add({ x: center, duration: periodTimeMillis / 4 });

    return timeLine.finished;
  };

  protected whiteOut = (onStartRefresh: Function, onComplete: Function) => {
    const timeLine = anime.timeline({
      targets: this.whiteLayer,
      easing: "linear"
    });

    timeLine
      // Start white out.
      .add({
        alpha: 1,
        duration: 100
      })
      // Refresh white out.
      .add({
        begin: onStartRefresh,
        alpha: 0,
        duration: 300
      })
      // Show result animation.
      .add({
        duration: 300,
        complete: onComplete
      });

    timeLine.play();
  };
}

export default ResultState;
