import { start } from "./app";

export const bootstrap = () => {
  console.log("launch app");

  start().then((app) => {
    document.body.appendChild(app.view);
  });
};

window.addEventListener("load", bootstrap);
