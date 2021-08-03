/**
 * @fileOverview Application state machine
 * @see https://xstate.js.org/viz/
 */
import { createMachine, interpret, StateValue } from "xstate";
import * as PIXI from "pixi-v6";
import { SoundMap } from "@pixi/sound";

import { GameApp } from "../GameApp";
import { AssetLoadingState } from "./states/AssetLoadingState";
import { TitleState } from "./states/TitleState";
import { GameCountState } from "./states/game/CountState";
import { GamePlayState } from "./states/game/PlayState";
import { GameOverState } from "./states/game/OverState";

const convertStateKeyFrom = (stateValue: StateValue): string => {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  const [key, value] = Object.entries(stateValue)[0];
  return `${key}.${convertStateKeyFrom(value)}`;
};

export interface AppContext {
  loader: {
    spriteMap: { [key: string]: PIXI.ILoaderResource };
    soundMap: SoundMap;
  };
}

export type AppEvent =
  | { type: "COMPLETED" }
  | { type: "START_GAME" }
  | { type: "REPLAY" }
  | { type: "END_GAME" };

export type AppTypestate =
  | {
      value: "idle";
      context: AppContext;
    }
  | {
      value: "loading";
      context: AppContext;
    }
  | {
      value: "success";
      context: AppContext;
    }
  | {
      value: "failure";
      context: AppContext;
    };

export const appMachine = createMachine<AppContext, AppEvent, AppTypestate>(
  {
    initial: "assetLoading",
    context: {
      loader: {
        spriteMap: {},
        soundMap: {},
      },
    },
    states: {
      assetLoading: {
        on: {
          COMPLETED: "title",
        },
        entry: ["handleStateEnter"],
        exit: ["handleStateExit"],
      },
      title: {
        id: "title",
        on: {
          START_GAME: "game",
        },
        entry: ["handleStateEnter"],
        exit: ["handleStateExit"],
      },
      game: {
        initial: "count",
        states: {
          count: {
            entry: ["handleStateEnter"],
            exit: ["handleStateExit"],
            on: {
              COMPLETED: "play",
            },
          },
          play: {
            entry: ["handleStateEnter"],
            exit: ["handleStateExit"],
            on: {
              COMPLETED: "over",
            },
          },
          over: {
            type: "final",
            entry: ["handleStateEnter"],
            exit: ["handleStateExit"],
            on: {
              REPLAY: "count",
              END_GAME: "#title",
            },
          },
        },
      },
    },
  },
  {
    actions: {
      handleStateEnter: (_context, _event, meta) => {
        const stateKey = convertStateKeyFrom(meta.state.value);
        console.log(`enter - ${stateKey}`);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-use-before-define
        const currentState = stateInstances[stateKey];
        currentState.onEnter();
      },
      handleStateExit: (_context, _event, meta) => {
        const stateKey = convertStateKeyFrom(meta.state.value);
        console.log(`enter - ${stateKey}`);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-use-before-define
        const currentState = stateInstances[stateKey];
        currentState.onExit();
      },
    },
  }
);

export const appService = interpret(appMachine);

let stateInstances = {};

export const startMachine = (app: GameApp): void => {
  stateInstances = {
    assetLoading: new AssetLoadingState({ app, machineService: appService }),
    title: new TitleState({ app, machineService: appService }),
    "game.count": new GameCountState({ app, machineService: appService }),
    "game.play": new GamePlayState({ app, machineService: appService }),
    "game.over": new GameOverState({ app, machineService: appService }),
  };

  appService.start();
};
