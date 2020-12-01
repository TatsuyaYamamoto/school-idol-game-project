import { Texture } from "pixi.js";

import AnimatedSprite from "../../internal/AnimatedSprite";

const ANIMATION_SPEED = 0.04;

export interface FrameStructureIndexes {
  WAIT: number[];
  TRY_ATTACK: number[];
  SUCCESS_ATTACK: number[];
  LOSE: number[];
  WIN: number[];
  LOSE_TEXTURE: number;
  WIN_TEXTURE: number;
}

abstract class Character extends AnimatedSprite {
  readonly _frameTextures: Texture[];

  private _frameStructureIndexes: FrameStructureIndexes;

  protected constructor(
    frameTextures: Texture[],
    indexes: FrameStructureIndexes
  ) {
    // initial animation state is wait.
    super(indexes.WAIT.map((i) => frameTextures[i]));

    this._frameTextures = frameTextures;
    this._frameStructureIndexes = indexes;

    this.animationSpeed = ANIMATION_SPEED;
  }

  abstract get name(): string;

  public get winTexture(): Texture {
    return this._frameTextures[this._frameStructureIndexes.WIN_TEXTURE];
  }

  public get loseTexture(): Texture {
    return this._frameTextures[this._frameStructureIndexes.LOSE_TEXTURE];
  }

  public playWait(): void {
    this.textures = this._getWaitTextures();
    if (!this.playing) {
      this.play();
    }
  }

  public playTryAttack(): void {
    this.textures = this._getTryAttackTextures();
    if (!this.playing) {
      this.play();
    }
  }

  public playSuccessAttack(): void {
    this.textures = this._getSuccessAttackTextures();
    if (!this.playing) {
      this.play();
    }
  }

  public playWin(): void {
    this.textures = this._getWinTextures();
    if (!this.playing) {
      this.play();
    }
  }

  public playLose(): void {
    this.textures = this._getLoseTextures();
    if (!this.playing) {
      this.play();
    }
  }

  private _getWaitTextures = (): Texture[] => {
    return this._frameStructureIndexes.WAIT.map((i) => this._frameTextures[i]);
  };

  private _getTryAttackTextures = (): Texture[] => {
    return this._frameStructureIndexes.TRY_ATTACK.map(
      (i) => this._frameTextures[i]
    );
  };

  private _getSuccessAttackTextures = (): Texture[] => {
    return this._frameStructureIndexes.SUCCESS_ATTACK.map(
      (i) => this._frameTextures[i]
    );
  };

  private _getWinTextures = (): Texture[] => {
    return this._frameStructureIndexes.WIN.map((i) => this._frameTextures[i]);
  };

  private _getLoseTextures = (): Texture[] => {
    return this._frameStructureIndexes.LOSE.map((i) => this._frameTextures[i]);
  };
}

export default Character;
