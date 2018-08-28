import { Graphics } from "pixi.js";
import { ViewContainer } from "@sokontokoro/mikan";

import GameView from "../GameView";

import Player from "../../../texture/sprite/character/Player";
import Opponent from "../../../texture/sprite/character/Opponent";
import Oimo from "../../../texture/sprite/character/Oimo";
import BackGround from "../../../texture/containers/BackGround";

class WhiteLayer extends Graphics {
  constructor(width: number, height: number) {
    super();
    this.beginFill(0xffffff);
    this.drawRect(-1 * width * 0.5, -1 * height * 0.5, width, height);
    this.endFill();
  }
}

abstract class GameViewState extends ViewContainer {
  private _gameView: GameView;

  private _background: BackGround;
  private _oimo: Oimo;

  private _whiteLayer: WhiteLayer;

  constructor(gameView: GameView) {
    super();

    this._gameView = gameView;

    this._background = new BackGround();
    this._background.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

    this._oimo = new Oimo();
    this._oimo.play();

    this._whiteLayer = new WhiteLayer(this.viewWidth, this.viewHeight);
    this._whiteLayer.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
    this._whiteLayer.alpha = 0;
  }

  protected get background(): BackGround {
    return this._background;
  }

  protected get player(): Player {
    return this._gameView.player;
  }

  protected get opponent(): Opponent {
    return this._gameView.opponent;
  }

  protected get oimo(): Oimo {
    return this._oimo;
  }

  protected get whiteLayer(): WhiteLayer {
    return this._whiteLayer;
  }

  /**
   * @override
   */
  update(elapsedMS: number): void {
    super.update(elapsedMS);

    this._background.progress(elapsedMS);
  }
}

export default GameViewState;
