import * as PIXI from "pixi.js";
import { Machine, interpret } from "xstate";

import { IdleState } from "./state/IdleState";
import { LoadingState } from "./state/LoadingState";
import { TitleState } from "./state/TitleState";

export const app = new PIXI.Application({ transparent: true });
document.getElementById("app").appendChild(app.view);

const stateInstances = {
  [IdleState.nodeKey]: new IdleState(app),
  [LoadingState.nodeKey]: new LoadingState(app),
  [TitleState.nodeKey]: new TitleState(app)
};

/**
 * https://xstate.js.org/viz/
 */
const gameMachine = {
  initial: "init",
  states: {
    init: {
      on: {
        startShuffle: "shuffle"
      }
    },
    shuffle: {
      on: {
        finished: "waitingForInput"
      }
    },
    waitingForInput: {
      on: {
        select: "result"
      }
    },
    result: {
      on: {
        correct: "shuffle",
        incorrect: "gameover"
      }
    },
    gameover: {
      on: {
        restart: "init",
        backTitle: `#app.${TitleState.nodeKey}`
      }
    }
  }
};

const appMachine = Machine(
  {
    id: "app",
    initial: IdleState.nodeKey,
    context: {},
    states: {
      [IdleState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          launch: LoadingState.nodeKey
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
          startGame: "game"
        }
      },
      game: {
        ...gameMachine
      }
    }
  },
  {
    actions: {
      handleStateEntry: (context, event) => {
        console.log("handleStateEntry", context, event, stateMachineService);
        const currentNodeKey = stateMachineService.state.value as string;
        const currentState = stateInstances[currentNodeKey];
        currentState.onEnter();
      },
      handleStateExit: (context, event) => {
        console.log("handleStateEntry", context, event, stateMachineService);
        const currentNodeKey = stateMachineService.state.value as string;
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
stateMachineService.send("launch");
