import * as PIXI from "pixi-v6";

export class Chisato extends PIXI.Container {
  private animatedSprite: PIXI.AnimatedSprite;

  private successSprite: PIXI.Sprite;

  private resultSprites: PIXI.Sprite[];

  public set animationSpeed(value: number) {
    this.animatedSprite.animationSpeed = value;
  }

  public constructor(params: {
    baseAnimationTextures: PIXI.Texture[];
    successTexture: PIXI.Texture;
    resultTextures: PIXI.Texture[];
  }) {
    super();

    this.animatedSprite = new PIXI.AnimatedSprite(params.baseAnimationTextures);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.animationSpeed = 0.1;

    this.successSprite = PIXI.Sprite.from(params.successTexture);
    this.successSprite.anchor.set(0.5);

    this.resultSprites = params.resultTextures.map((t) => {
      const s = PIXI.Sprite.from(t);
      s.anchor.set(0.5);
      return s;
    });

    this.addChild(this.animatedSprite);
  }

  public setScale(value: number): void {
    this.animatedSprite.scale.set(value);
    this.successSprite.scale.set(value);
    this.resultSprites.forEach((r) => {
      r.scale.set(value);
    });
  }

  public playAnimation(): void {
    this.animatedSprite.play();
  }

  public stopAnimation(): void {
    this.animatedSprite.stop();
  }

  public showSuccess(): void {
    this.removeChildren();
    this.addChild(this.successSprite);
  }

  public showAnimation(): void {
    this.removeChildren();
    this.addChild(this.animatedSprite);
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
