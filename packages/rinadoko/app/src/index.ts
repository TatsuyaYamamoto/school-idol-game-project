import * as PIXI from "pixi.js";
import { Machine, interpret } from "xstate";

import { IdleState } from "./state/IdleState";
import { LoadingState } from "./state/LoadingState";
import { TitleState } from "./state/TitleState";
import { GameState } from "./state/GameState";

const canvasWindowAspectRatio = 4 / 3;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
let canvasWidth;
let canvasHeight;

if (windowWidth * canvasWindowAspectRatio < windowHeight /*portrait*/) {
  canvasWidth = windowWidth;
  canvasHeight = canvasWidth * canvasWindowAspectRatio;
} /* landscape*/ else {
  canvasHeight = windowHeight;
  canvasWidth = canvasHeight / canvasWindowAspectRatio;
}
const unitWidth = 4000;
const scale = canvasWidth / unitWidth;

export const app = new PIXI.Application({
  width: canvasWidth,
  height: canvasHeight,
  transparent: true
  // backgroundColor: 0xeeeeee
});
document.getElementById("app").appendChild(app.view);
const context = { app, scale };

const stateInstances = {
  [IdleState.nodeKey]: new IdleState(context),
  [LoadingState.nodeKey]: new LoadingState(context),
  [TitleState.nodeKey]: new TitleState(context),
  [IdleState.nodeKey]: new IdleState(context),
  [GameState.nodeKey]: new GameState(context)
};

/**
 * https://xstate.js.org/viz/
 */
const appMachine = Machine(
  {
    id: "app",
    initial: IdleState.nodeKey,
    context: {
      currentNodeKey: IdleState.nodeKey
    },
    states: {
      [IdleState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          LAUNCH: LoadingState.nodeKey
        }
      },
      [LoadingState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          LOADED: TitleState.nodeKey
        }
      },
      [TitleState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          START_GAME: GameState.nodeKey
        }
      },
      [GameState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {}
      }
    }
  },
  {
    actions: {
      handleStateEntry: (context, event) => {
        const stateValue = stateMachineService.state.value;
        const currentNodeKey = stateValue["game"] || stateValue;

        context.currentNodeKey = currentNodeKey;
        console.log(`entry - ${currentNodeKey}`, context, event);

        const currentState = stateInstances[currentNodeKey];
        currentState.onEnter();
      },
      handleStateExit: (context, event) => {
        const currentNodeKey = context.currentNodeKey;
        console.log(`exit  - ${currentNodeKey}`, context, event);

        const currentState = stateInstances[currentNodeKey];
        currentState.onExit();
      }
    }
  }
);

export const stateMachineService = interpret(appMachine);

export interface State {
  onEnter();
  onExit();
}

stateMachineService.start();
stateMachineService.send("LAUNCH");
