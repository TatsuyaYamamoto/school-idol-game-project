import { startMachine } from "./state-machine";
import { GameApp } from "./GameApp";

const appEl = document.getElementById("app");
const guideBeforeLaunchEl = document.getElementById("guide-before-launch");

export const bootstrap = (): void => {
  console.log("launch app");

  if (appEl && guideBeforeLaunchEl) {
    appEl.style.display = "flex";
    guideBeforeLaunchEl.style.display = "none";

    const app = new GameApp();
    appEl.appendChild(app.view);

    startMachine(app);
  }
};

guideBeforeLaunchEl?.addEventListener("start", () => {
  bootstrap();
});
guideBeforeLaunchEl?.setAttribute("ready", "true");
