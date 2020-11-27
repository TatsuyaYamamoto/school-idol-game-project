import * as PIXI from "pixi.js";

import State from "./State";
import config from "./config";

/**
 * Root class of the application.
 * This class has renderer, ticker and root container provided from pixi.js.
 *
 * This is implemented as {@link State}, but it's not expected to be managed with {@link StateMachine}.
 * You can call {@link this#start} to enter this application state.
 *
 * After calling {@link this#start}, the application is ticking. {@link this#update} is fired each tick.
 * You can use it as a game loop logic.
 *
 *
 * @example
 * // import subclass that extends this.
 * import MyApplication from 'hogehoge';
 *
 * // Create the application
 * const app = new MyApplication();
 *
 * // Add the view to the DOM
 * document.body.appendChild(app.view);
 *
 * // Start ticking!
 * app.start();
 *
 * @class
 */
abstract class Application extends PIXI.Application implements State {
  constructor(options: PIXI.ApplicationOptions) {
    super(
      Object.assign(
        {
          backgroundColor: config.rendererBackgroundColor,
          autoStart: false,
        },
        options
      )
    );

    // setup tick callback function.
    this.ticker.add(() => this.update(this.ticker.elapsedMS));
  }

  /**
   * Start application.
   *
   * @see PIXI.Application#start
   * @override
   */
  public start(): void {
    super.start(); // start application tick.
    this.onEnter(); // enter application state.
  }

  /**
   * Stop application.
   * @see PIXI.Application#stop
   * @override
   */
  public stop(): void {
    super.stop(); // stop application tick.
    this.onExit(); // exit application state.
  }

  /**
   * @param {number} deltaTime
   * @inheritDoc
   * @override
   */
  update(deltaTime: number): void {
    console.log(deltaTime);
  }

  /**
   * @inheritDoc
   * @override
   */
  onEnter(): void {}

  /**
   * @inheritDoc
   * @override
   */
  onExit(): void {}
}

export default Application;
