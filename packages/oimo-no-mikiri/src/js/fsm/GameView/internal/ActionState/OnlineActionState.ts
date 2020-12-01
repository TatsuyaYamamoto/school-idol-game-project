import * as anime from "animejs";

import * as Mousetrap from "mousetrap";
import { DisplayObject } from "pixi.js";
import ActionState, { EnterParams as ActionEnterParams } from "./ActionState";
import BattleStatusBoard from "../../../../texture/containers/label/BattleStatusBoard";
import Actor from "../../../../models/Actor";
import PlayCharaIndicateLabel from "../../../../texture/containers/PlayCharaIndicateLabel";

export interface EnterParams extends ActionEnterParams {
  battleLeft: number;
  wins: { onePlayer: number; twoPlayer: number };
  isFalseStarted?: { player?: boolean; opponent?: boolean };
}

class OnlineActionState extends ActionState {
  private battleStatusBoard: BattleStatusBoard;

  private playerCharaIndicateLabel: PlayCharaIndicateLabel;

  private opponentCharaIndicateLabel: PlayCharaIndicateLabel;

  private playerAttachAreaRange: number;

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

    this.playerAttachAreaRange = window.innerWidth / 2;

    this.battleStatusBoard = new BattleStatusBoard(
      this.viewWidth,
      this.viewHeight
    );
    this.battleStatusBoard.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.12
    );
    this.battleStatusBoard.battleLeft = params.battleLeft;
    this.battleStatusBoard.onePlayerWins = params.wins.onePlayer;
    this.battleStatusBoard.twoPlayerWins = params.wins.twoPlayer;

    this.playerCharaIndicateLabel = new PlayCharaIndicateLabel("あなた");
    this.playerCharaIndicateLabel.position.set(
      this.viewWidth * 0.3,
      this.viewHeight * 0.25
    );

    this.opponentCharaIndicateLabel = new PlayCharaIndicateLabel("あいて");
    this.opponentCharaIndicateLabel.position.set(
      this.viewWidth * 0.7,
      this.viewHeight * 0.25
    );

    this.backGroundLayer.addChild(this.background);
    this.applicationLayer.addChild<DisplayObject>(
      this.oimo,
      this.player,
      this.opponent,
      this.playerFalseStartCheck,
      this.opponentFalseStartCheck,
      this.signalSprite,
      this.battleStatusBoard,
      this.playerCharaIndicateLabel,
      this.opponentCharaIndicateLabel
    );

    Mousetrap.bind("a", () => {
      this.onAttacked(Actor.PLAYER);
    });

    // Fade out player and opponent indicate label.
    const values = {
      playerAlpha: 1,
      opponentAlpha: 1,
    };

    anime({
      easing: "linear",
      delay: 700,
      duration: 1000,
      targets: values,
      playerAlpha: 0,
      opponentAlpha: 0,
      update: () => {
        this.playerCharaIndicateLabel.alpha = values.playerAlpha;
        this.opponentCharaIndicateLabel.alpha = values.opponentAlpha;
      },
    });
  }

  /**
   * @override
   */
  bindKeyboardEvents(): void {
    Mousetrap.bind("a", () => {
      this.onAttacked(Actor.PLAYER);
    });
  }

  /**
   * @override
   */
  // eslint-disable-next-line
  unbindKeyboardEvents(): void {
    Mousetrap.unbind("a");
  }

  /**
   *
   * @override
   */
  onWindowTaped(): void {
    this.onAttacked(Actor.PLAYER);
  }
}

export default OnlineActionState;
