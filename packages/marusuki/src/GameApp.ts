import * as PIXI from "pixi-v6";

const { canvasWidth, canvasHeight, scale } = ((
  aspectRatio: number,
  unitWidth: number
) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (windowWidth * aspectRatio < windowHeight) {
    /* portrait */
    return {
      canvasWidth: windowWidth,
      canvasHeight: windowWidth * aspectRatio,
      scale: windowWidth / unitWidth,
    };
  }
  /* landscape */
  return {
    canvasHeight: windowHeight,
    canvasWidth: windowHeight / aspectRatio,
    scale: windowWidth / (windowHeight / aspectRatio),
  };
})(3 / 4, 800);

export class GameApp extends PIXI.Application {
  public get scale(): number {
    return scale;
  }

  public get width(): number {
    return this.renderer.width;
  }

  public get height(): number {
    return this.renderer.height;
  }

  constructor() {
    super({
      backgroundColor: parseInt("#f3f2f2".replace("#", ""), 16),
      width: canvasWidth,
      height: canvasHeight,
    });
  }

  public getX(ratio: number): number {
    return this.renderer.width * ratio;
  }

  public getY(ratio: number): number {
    return this.renderer.height * ratio;
  }
}
