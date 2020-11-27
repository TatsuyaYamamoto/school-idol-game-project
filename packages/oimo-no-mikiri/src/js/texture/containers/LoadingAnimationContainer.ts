import { Container, DisplayObject } from "pixi.js";

import { BrandLogoAnimation } from "@sokontokoro/mikan";

import Text from "../../texture/internal/Text";
import KotoriImage from "../sprite/KotoriImage";

class LoadProgressText extends Text {
  constructor() {
    super(`Now loading... 0%`, {
      fontSize: 30,
      fontFamily: "PixelMplus10-Regular"
    });
  }

  progress(percentage: number) {
    this.text = `Now loading... ${Math.round(percentage)}%`;
  }
}

class LoadProgressKotoriImage extends KotoriImage {
  private _distance: number;

  constructor(distance) {
    super();
    this._distance = distance;
  }

  progress(percentage: number) {
    this.rotation = (2 * Math.PI * percentage) / 100;
    this.position.x =
      -1 * this._distance * 0.5 + (this._distance * percentage) / 100;
  }
}

class LoadingAnimationContainer extends Container {
  private _loadProgressText: LoadProgressText;
  private _brandLogoAnimation: BrandLogoAnimation;
  private _kotoriImage: LoadProgressKotoriImage;

  private _max: number;

  constructor(width: number, height: number) {
    super();

    this._max = 100;

    this._loadProgressText = new LoadProgressText();
    this._loadProgressText.position.set(0, height * 0.4);

    this._brandLogoAnimation = new BrandLogoAnimation();
    this._brandLogoAnimation.position.set(0, 0);

    this._kotoriImage = new LoadProgressKotoriImage(width * 0.3);
    this._kotoriImage.position.set(0, height * 0.25);
    this._kotoriImage.scale.set(0.2);
    this._kotoriImage.progress(0);

    this.addChild<DisplayObject>(
      this._brandLogoAnimation,
      this._kotoriImage,
      this._loadProgressText
    );
  }

  /**
   *
   * @returns {Promise<any>}
   */
  start(): Promise<any> {
    return this._brandLogoAnimation.start();
  }

  /**
   *
   * @param percentage
   */
  progress(percentage): void {
    this._kotoriImage.progress(percentage);
    this._loadProgressText.progress(percentage);
  }
}

export default LoadingAnimationContainer;
