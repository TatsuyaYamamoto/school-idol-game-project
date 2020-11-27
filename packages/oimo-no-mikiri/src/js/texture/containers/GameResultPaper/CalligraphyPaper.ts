import { Graphics } from "pixi.js";

/**
 * Graphics of calligraphy paper.
 * This is background {@link Container} in {@link GameResultPaper}
 * Shape of {@link CalligraphyPaper} is RoundedRect that has width and height provided from constructor's params.
 *
 * @class
 */
class CalligraphyPaper extends Graphics {
  constructor(width: number, height: number) {
    super();

    this.beginFill(0xffffff, 0.95);
    this.drawRoundedRect(-1 * width * 0.5, -1 * height * 0.5, width, height, 3);
    this.endFill();

    const paperWeightWidth = width * 0.8;
    const paperWeightHeight = height * 0.035;
    this.beginFill(0xc0c0c0);
    this.drawRoundedRect(
      -1 * paperWeightWidth * 0.5,
      -1 * height * 0.47,
      paperWeightWidth,
      paperWeightHeight,
      4
    );
    this.endFill();
  }
}

export default CalligraphyPaper;
