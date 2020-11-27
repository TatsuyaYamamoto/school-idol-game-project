import { DisplayObject, filters } from "pixi.js";
import * as anime from "animejs";

import { Deliverable, dispatchEvent } from "@sokontokoro/mikan";

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

    // eslint-disable-next-line no-nested-ternary
    const type = params.winner
      ? params.winner === Actor.PLAYER
        ? "playerWin"
        : "opponentWin"
      : params.falseStarter
      ? "falseStart"
      : "draw";

    // eslint-disable-next-line no-nested-ternary
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

    this.applicationLayer.addChild<DisplayObject>(
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
      loop: 3,
    });

    const getAnimParam = (x: number) => ({
      x,
      targets: target.position,
      duration: periodTimeMillis / 4,
      easing: "linear",
    });

    timeLine
      .add(getAnimParam(right))
      .add(getAnimParam(center))
      .add(getAnimParam(left))
      .add(getAnimParam(center));

    return timeLine.finished;
  };

  protected whiteOut = (
    onStartRefresh: () => void,
    onComplete: () => void
  ): void => {
    const timeLine = anime.timeline({});

    timeLine
      // Start white out.
      .add({
        targets: this.whiteLayer,
        alpha: 1,
        duration: 100,
        easing: "linear",
      })
      // Refresh white out.
      .add({
        targets: this.whiteLayer,
        begin: onStartRefresh,
        alpha: 0,
        duration: 300,
        easing: "linear",
      })
      // Show result animation.
      .add({
        targets: this.whiteLayer,
        duration: 300,
        complete: onComplete,
        easing: "linear",
      });

    timeLine.play();
  };
}

export default ResultState;
