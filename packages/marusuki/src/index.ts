import app from "./app";

export const bootstrap = () => {
  console.log("start app");
  document.body.appendChild(app.view);
};

window.addEventListener("load", bootstrap);
