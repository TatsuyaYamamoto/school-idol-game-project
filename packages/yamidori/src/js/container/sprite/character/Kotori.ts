import ClickableSprite from "../ClickableSprite";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";
import { GAME_PARAMETERS } from "../../../Constants";

export enum Speed {
  LOW = GAME_PARAMETERS.KOTORI_SPEED_LOW,
  MIDDLE = GAME_PARAMETERS.KOTORI_SPEED_MIDDLE,
  HIGH = GAME_PARAMETERS.KOTORI_SPEED_HIGH,
}

export enum Direction {
  RIGHT,
  LEFT,
}

interface ConstructorParams {
  direction?: Direction;
  speed?: Speed;
}

const defaultConstructorParams: ConstructorParams = {
  direction: Direction.RIGHT,
  speed: Speed.LOW,
};

class Kotori extends ClickableSprite {
  private _direction: Direction;
  private _id: number;
  private _speed: Speed;

  public constructor(params?: ConstructorParams) {
    params = Object.assign({}, defaultConstructorParams, params);
    super(
      loadTexture(
        params.direction === Direction.RIGHT
          ? Ids.KOTORI_RIGHT
          : Ids.KOTORI_LEFT
      )
    );

    this.buttonMode = true;
    this._direction = params.direction;
    this._id = Date.now();
    this._speed = params.speed;
  }

  /**
   * Get identifier of the instance.
   *
   * @return {number}
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Get direction of the instance.
   *
   * @return {Direction}
   */
  public get direction(): Direction {
    return this._direction;
  }

  /**
   * Get speed of the instance.
   *
   * @return {Speed}
   */
  public get speed(): Speed {
    return this._speed;
  }

  /**
   * Destroy kotori-chun.
   * Before {@link this#destroy} decrement alpha.
   */
  public destroyByTap(): void {
    this.interactive = false;

    Promise.resolve()
      .then(() => {
        return new Promise((resolve) => {
          this.startAlphaDecrementLoop(resolve);
        });
      })
      .then(() => this.destroy());
  }

  private startAlphaDecrementLoop(callback) {
    setTimeout(() => {
      this.alpha -= 0.2;

      if (this.alpha > 0) {
        this.startAlphaDecrementLoop(callback);
      } else {
        callback();
      }
    }, 33); // 1000 ms / 30FPS
  }
}

export default Kotori;
