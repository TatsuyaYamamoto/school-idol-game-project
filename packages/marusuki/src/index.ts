import { start } from "./app";

export const bootstrap = (): void => {
  console.log("launch app");

  start().then((app) => {
    document.getElementById("app")?.appendChild(app.view);
  });
};

window.addEventListener("load", bootstrap);
