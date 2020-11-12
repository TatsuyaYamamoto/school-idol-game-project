import * as PIXI from "pixi.js";
import { Machine, interpret } from "xstate";

import { IdleState } from "./state/IdleState";
import { LoadingState } from "./state/LoadingState";
import { TitleState } from "./state/TitleState";
import { GameState } from "./state/GameState";

export const app = new PIXI.Application({
  // transparent: true
  backgroundColor: 0xeeeeee
});
document.getElementById("app").appendChild(app.view);

const stateInstances = {
  [IdleState.nodeKey]: new IdleState(app),
  [LoadingState.nodeKey]: new LoadingState(app),
  [TitleState.nodeKey]: new TitleState(app),
  [IdleState.nodeKey]: new IdleState(app),
  [GameState.nodeKey]: new GameState(app)
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
