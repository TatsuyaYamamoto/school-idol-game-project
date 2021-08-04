import * as PIXI from "pixi-v6";
import { SpriteMap } from "../helper/loader";

export class Chisato extends PIXI.Container {
  private animatedSprite: PIXI.AnimatedSprite;

  private successSprite: PIXI.Sprite;

  private failureSprite: PIXI.Sprite;

  private resultSprites: PIXI.Sprite[];

  public set animationSpeed(value: number) {
    this.animatedSprite.animationSpeed = value;
  }

  public constructor(params: { spriteMap: SpriteMap }) {
    super();
    const baseAnimationTextures = Object.entries(
      params.spriteMap["chisato.spritesheet"].textures || {}
    ).map(([, t]) => t);
    const successTexture = params.spriteMap.chisato_success
      .texture as PIXI.Texture;
    const failureTexture = params.spriteMap.chisato_failure
      .texture as PIXI.Texture;
    const resultTextures = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      (i) => params.spriteMap[`chisato_gameover_${i}`].texture as PIXI.Texture
    );

    this.animatedSprite = new PIXI.AnimatedSprite(baseAnimationTextures);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.animationSpeed = 0.1;
    this.animatedSprite.stop();

    this.successSprite = PIXI.Sprite.from(successTexture);
    this.successSprite.anchor.set(0.5);

    this.failureSprite = PIXI.Sprite.from(failureTexture);
    this.failureSprite.anchor.set(0.5);

    this.resultSprites = resultTextures.map((t) => {
      const s = PIXI.Sprite.from(t);
      s.anchor.set(0.5);
      return s;
    });

    this.addChild(this.animatedSprite);
  }

  public setScale(value: number): void {
    this.animatedSprite.scale.set(value);
    this.successSprite.scale.set(value);
    this.failureSprite.scale.set(value);
    this.resultSprites.forEach((r) => {
      r.scale.set(value);
    });
  }

  public startAnimation(): void {
    this.animatedSprite.play();
  }

  public stopAnimation(): void {
    this.animatedSprite.stop();
  }

  public showAnimation(): void {
    this.removeChildren();
    this.addChild(this.animatedSprite);
  }

  public showSuccess(): void {
    this.removeChildren();
    this.addChild(this.successSprite);
  }

  public showFailure(): void {
    this.removeChildren();
    this.addChild(this.failureSprite);
  }

  public showResult(point: number): void {
    this.removeChildren();
    // eslint-disable-next-line yoda
    if (0 <= point && point <= 9) {
      this.addChild(this.resultSprites[point]);
      return;
    }

    this.addChild(this.resultSprites[10]);
  }
}
