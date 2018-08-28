import { Texture, Sprite, Container } from "pixi.js";

import { Deliverable, dispatchEvent, play } from "@sokontokoro/mikan";

import GameViewState from "../GameViewState";
import { Events } from "../../GameView";

import RestartButton from "../../../../texture/sprite/button/RestartButton";
import BackToTopButton from "../../../../texture/sprite/button/BackToTopButton";
import GameOverLogo from "../../../../texture/sprite/GameOverLogo";
import CalligraphyPaper from "../../../../texture/containers/GameResultPaper/CalligraphyPaper";
import TopTime from "../../../../texture/containers/GameResultPaper/TopTime";
import PlayerName from "../../../../texture/containers/GameResultPaper/PlayerName";
import WinnerName from "../../../../texture/containers/GameResultPaper/WinnerName";

import Actor from "../../../../models/Actor";
import Mode from "../../../../models/Mode";

import { Action, Category, trackEvent } from "../../../../helper/tracker";

import { Ids as SoundIds } from "../../../../resources/sound";

export interface EnterParams extends Deliverable {
  winner: Actor;
  bestTime: number;
  mode: Mode;
}

abstract class OverState extends GameViewState {
  private _gameOverLogo: GameOverLogo;
  private _restartButton: RestartButton;
  private _backToTopButton: BackToTopButton;

  // TODO: implements once method
  private isRestartTapped;

  private _resultPaper: Container;

  protected get gameOverLogo(): GameOverLogo {
    return this._gameOverLogo;
  }

  protected get restartButton(): RestartButton {
    return this._restartButton;
  }

  protected get backToTopButton(): BackToTopButton {
    return this._backToTopButton;
  }

  protected get resultPaper(): Container {
    return this._resultPaper;
  }

  /**
   * @override
   */
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    const { winner, bestTime, mode } = params;

    this._gameOverLogo = new GameOverLogo();
    this._gameOverLogo.position.set(
      this.viewWidth * 0.75,
      this.viewHeight * 0.1
    );
    this._gameOverLogo.scale.set(0.5);

    this._restartButton = new RestartButton();
    this._restartButton.position.set(
      this.viewWidth * 0.15,
      this.viewHeight * 0.8
    );
    this._restartButton.setOnClickListener(this._onClickRestartButton);

    this._backToTopButton = new BackToTopButton();
    this._backToTopButton.position.set(
      this.viewWidth * 0.85,
      this.viewHeight * 0.8
    );
    this._backToTopButton.setOnClickListener(this._onClickBackToTopButton);

    this._resultPaper = new Container();
    this._resultPaper.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

    this.isRestartTapped = false;

    const paperHeight = this.viewHeight * 0.9;
    const paperWidth = paperHeight * (1 / Math.sqrt(2));

    const calligraphyPaper = new CalligraphyPaper(paperWidth, paperHeight);

    const topTime = new TopTime(bestTime);
    topTime.position.set(paperWidth * 0.45, -1 * paperHeight * 0.1);

    const playerName = new PlayerName(this.player.name);
    playerName.position.set(-1 * paperWidth * 0.4, paperHeight * 0.2);

    const winnerName = new WinnerName(
      winner === Actor.PLAYER ? this.player.name : this.opponent.name
    );
    winnerName.position.set(0, paperHeight * 0.05);

    const playerSprite =
      winner === Actor.PLAYER
        ? this._from(this.player.winTexture)
        : this._from(this.player.loseTexture);
    playerSprite.position.set(-1 * paperWidth * 0.2, paperHeight * 0.3);

    const opponentSprite =
      winner === Actor.PLAYER
        ? this._from(this.opponent.loseTexture)
        : this._from(this.opponent.winTexture);
    opponentSprite.position.set(paperWidth * 0.2, paperHeight * 0.3);

    this._resultPaper.addChild(
      calligraphyPaper,
      topTime,
      playerName,
      winnerName,
      playerSprite,
      opponentSprite
    );

    // track result
    this._trackAchievementToGa(bestTime, mode, winner);
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();
  }

  /**
   *
   * @private
   */
  private _onClickRestartButton = () => {
    if (this.isRestartTapped) {
      return;
    }
    this.isRestartTapped = true;

    dispatchEvent(Events.RESTART_GAME);
    play(SoundIds.SOUND_OK);

    trackEvent(Category.BUTTON, Action.TAP, "restart_game");
  };

  /**
   *
   * @private
   */
  protected _onClickBackToTopButton = () => {
    dispatchEvent(Events.BACK_TO_TOP);
  };

  private _trackAchievementToGa = (
    bestTime: number,
    mode: Mode,
    winner: Actor
  ) => {
    trackEvent(Category.ACHIEVEMENT, `Fixed_${mode}`, winner, bestTime);
  };

  protected _from = (texture: Texture): Sprite => {
    const s = new Sprite(texture);
    s.anchor.set(0.5);
    s.scale.set(0.5);
    return s;
  };
}

export default OverState;
