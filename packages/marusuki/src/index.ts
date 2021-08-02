import * as PIXI from "pixi-v6";
import { startMachine } from "./stateMachine";

const appEl = document.getElementById("app");
const guideBeforeLaunchEl = document.getElementById("guide-before-launch");

export const bootstrap = (): void => {
  console.log("launch app");

  if (appEl && guideBeforeLaunchEl) {
    appEl.style.display = "flex";
    guideBeforeLaunchEl.style.display = "none";

    const app = new PIXI.Application({
      backgroundColor: parseInt("#f3f2f2".replace("#", ""), 16),
      autoStart: false,
    });
    appEl.appendChild(app.view);

    startMachine(app);
  }
};

guideBeforeLaunchEl?.addEventListener("start", () => {
  bootstrap();
});
guideBeforeLaunchEl?.setAttribute("ready", "true");
