import { Application, TextMetrics } from "pixi.js";
import { Machine, interpret, assign } from "xstate";

import { IdleState } from "./state/IdleState";
import { LoadingState } from "./state/LoadingState";
import { GameTitle } from "./state/GameTitle";
import { GameCoverBoxState } from "./state/GameCoverBoxState";
import { GameShuffleState } from "./state/GameShuffleState";
import { GameSelectBoxState } from "./state/GameSelectBoxState";
import { GameResultState } from "./state/GameResultState";

// https://okayu-moka.hatenablog.com/entry/2019/02/11/160906
TextMetrics.BASELINE_SYMBOL += "あ｜";

const canvasWindowAspectRatio = 4 / 3;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
let canvasWidth;
let canvasHeight;

if (windowWidth * canvasWindowAspectRatio < windowHeight /* portrait */) {
  canvasWidth = windowWidth;
  canvasHeight = canvasWidth * canvasWindowAspectRatio;
} /* landscape */ else {
  canvasHeight = windowHeight;
  canvasWidth = canvasHeight / canvasWindowAspectRatio;
}
const unitWidth = 4000;
const scale = canvasWidth / unitWidth;

const MAX_MOVE_DURATION = 0.5;
const MIN_MOVE_DURATION = 0.2;

export const app = new Application({
  view: document.getElementById("pixi") as HTMLCanvasElement,
  width: canvasWidth,
  height: canvasHeight,
  transparent: true,
  // backgroundColor: 0xeeeeee
});

/**
 * https://xstate.js.org/viz/
 */
const appMachine = Machine(
  {
    id: "app",
    initial: IdleState.nodeKey,
    context: {
      correctSelectCount: 0,
      candidateNumber: 3,
      moveDuration: MAX_MOVE_DURATION,
      currentNodeKey: IdleState.nodeKey,
      rinaCandidates: [],
    },
    states: {
      [IdleState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          LAUNCH: LoadingState.nodeKey,
        },
      },
      [LoadingState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          LOADED: "",
          SHOW_TITLE: GameTitle.nodeKey,
        },
      },
      [GameTitle.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          GAME_START: {
            target: GameCoverBoxState.nodeKey,
            actions: [
              assign({
                correctSelectCount: () => 0,
                moveDuration: () => MAX_MOVE_DURATION,
              }),
            ],
          },
        },
      },
      [GameCoverBoxState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          COVER_BOX_COMPLETED: GameShuffleState.nodeKey,
        },
      },
      [GameShuffleState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          SHUFFLE_COMPLETED: GameSelectBoxState.nodeKey,
        },
      },
      [GameSelectBoxState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          BOX_SELECTED_OK: {
            target: GameShuffleState.nodeKey,
            actions: [
              assign({
                // TODO
                // eslint-disable-next-line
                // @ts-ignore
                correctSelectCount: (context) => context.correctSelectCount + 1,

                moveDuration: (context) => {
                  // TODO
                  // eslint-disable-next-line
                  // @ts-ignore
                  if (context.moveDuration <= MIN_MOVE_DURATION) {
                    return MIN_MOVE_DURATION;
                  }
                  // TODO
                  // eslint-disable-next-line
                  // @ts-ignore
                  return context.moveDuration - 0.02;
                },
              }),
            ],
          },
          BOX_SELECTED_NG: GameResultState.nodeKey,
        },
      },
      [GameResultState.nodeKey]: {
        entry: ["handleStateEntry"],
        exit: ["handleStateExit"],
        on: {
          RESTART: GameTitle.nodeKey,
        },
      },
    },
    on: {
      "rinaCandidates.UPDATE": {
        actions: assign({
          // TODO
          // eslint-disable-next-line
          // @ts-ignore
          rinaCandidates: (_, event) => event.rinaCandidates,
        }),
      },
    },
  },
  {
    actions: {
      handleStateEntry: (context, event) => {
        // eslint-disable-next-line
        const currentNodeKey = stateMachineService.state.value as string;

        context.currentNodeKey = currentNodeKey;
        console.log(`entry - ${currentNodeKey}`, context, event);

        // eslint-disable-next-line
        const currentState = stateInstances[currentNodeKey];
        currentState.onEnter({ context });
      },
      handleStateExit: (context, event) => {
        const { currentNodeKey } = context;
        console.log(`exit  - ${currentNodeKey}`, context, event);

        // eslint-disable-next-line
        const currentState = stateInstances[currentNodeKey];
        currentState.onExit({ context });
      },
    },
  }
);

const context = { app, scale };
export type StateContext = typeof context;
const stateInstances = {
  [IdleState.nodeKey]: new IdleState(context),
  [LoadingState.nodeKey]: new LoadingState(context),
  [IdleState.nodeKey]: new IdleState(context),
  [GameTitle.nodeKey]: new GameTitle(context),
  [GameCoverBoxState.nodeKey]: new GameCoverBoxState(context),
  [GameShuffleState.nodeKey]: new GameShuffleState(context),
  [GameSelectBoxState.nodeKey]: new GameSelectBoxState(context),
  [GameResultState.nodeKey]: new GameResultState(context),
};

export const stateMachineService = interpret(appMachine);

export type StateMachineContext = typeof appMachine["context"];

export type StateEnterParams = {
  context: StateMachineContext;
};

export type StateExitParams = {
  context: StateMachineContext;
};

export interface State {
  onEnter(params: StateEnterParams): void;
  onExit(params: StateExitParams): void;
}

window.addEventListener("load", () => {
  stateMachineService.start();
  stateMachineService.send("LAUNCH");
});
