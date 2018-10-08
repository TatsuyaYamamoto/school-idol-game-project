import { Spinner } from "spin.js";

const SPINNER_ID = "connection-indicator";

const SPINNER_OPTS = {
  lines: 9, // The number of lines to draw
  length: 4, // The length of each line
  width: 3, // The line thickness
  radius: 5, // The radius of the inner circle
  // scale: 1, // Scales overall size of the spinner
  // corners: 1, // Corner roundness (0..1)
  // color: '#ffffff', // CSS color or array of colors
  // fadeColor: 'transparent', // CSS color or array of colors
  // opacity: 0.25, // Opacity of the lines
  // rotate: 0, // The rotation offset
  // direction: 1, // 1: clockwise, -1: counterclockwise
  // speed: 1, // Rounds per second
  // trail: 60, // Afterglow percentage
  // fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
  // zIndex: 2e9, // The z-index (defaults to 2000000000)
  // className: 'spinner', // The CSS class to assign to the spinner
  top: "50%", // Top position relative to parent
  left: "15%" // Left position relative to parent
  // shadow: "none", // Box-shadow for the lines
  // position: 'relative' // Element positioning
};

const spinner = new Spinner(SPINNER_OPTS).spin().el as HTMLElement;

const background = document.createElement("div");
background.style.position = "absolute";
background.style.width = "100%";
background.style.height = "100%";
background.style.backgroundColor = "rgb(255, 255, 255)";
background.style.opacity = "0.7";
background.style.borderRadius = "20px";
background.style.filter = "blur(2px)";

const text = document.createElement("div");
text.innerText = "Connecting";
text.style.position = "relative";
text.style.zIndex = "100";
text.style.marginLeft = "40px";
text.style.marginRight = "10px";
text.style.marginTop = "5px";
text.style.marginBottom = "5px";

const indicator = document.createElement("div");
indicator.id = SPINNER_ID;
indicator.style.position = "absolute";
indicator.style.top = "0%";
indicator.style.right = "0%";
indicator.style.marginRight = "2%";
indicator.style.marginTop = "2%";

indicator.appendChild(spinner);
indicator.appendChild(background);
indicator.appendChild(text);
document.body.appendChild(indicator);

hide();

export function show() {
  indicator.hidden = false;
}

export function hide() {
  indicator.hidden = true;
}
