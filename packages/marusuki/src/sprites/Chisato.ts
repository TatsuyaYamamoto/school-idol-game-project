import * as PIXI from "pixi-v6";

export class Chisato extends PIXI.Container {
  private animatedSprite: PIXI.AnimatedSprite;

  private successSprite: PIXI.Sprite;

  public set animationSpeed(value: number) {
    this.animatedSprite.animationSpeed = value;
  }

  public constructor(params: {
    baseAnimationTextures: PIXI.Texture[];
    successTexture: PIXI.Texture;
  }) {
    super();

    this.animatedSprite = new PIXI.AnimatedSprite(params.baseAnimationTextures);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.animationSpeed = 0.1;

    this.successSprite = PIXI.Sprite.from(params.successTexture);
    this.successSprite.anchor.set(0.5);

    this.addChild(this.animatedSprite);
  }

  public setScale(value: number): void {
    this.animatedSprite.scale.set(value);
    this.successSprite.scale.set(value);
  }

  public playAnimation(): void {
    this.animatedSprite.play();
  }

  public showSuccess(): void {
    this.addChild(this.successSprite);
    this.removeChild(this.animatedSprite);
  }

  public showAnimation(): void {
    this.addChild(this.animatedSprite);
    this.removeChild(this.successSprite);
  }
}
