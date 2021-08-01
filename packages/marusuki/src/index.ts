import { start } from "./app";

const appEl = document.getElementById("app");
const guideBeforeLaunchEl = document.getElementById("guide-before-launch");

export const bootstrap = (): void => {
  console.log("launch app");

  if (appEl && guideBeforeLaunchEl) {
    appEl.style.display = "flex";
    guideBeforeLaunchEl.style.display = "none";
    start(appEl);
  }
};

guideBeforeLaunchEl?.addEventListener("start", () => {
  bootstrap();
});
guideBeforeLaunchEl?.setAttribute("ready", "true");
