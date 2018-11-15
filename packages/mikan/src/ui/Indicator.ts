import { Spinner } from "spin.js";

const SPINNER_ID = "connection-indicator";
const ICON_MARGIN = "40px";
const NO_ICON_MARGIN = "10px";

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

const backgroundNode = document.createElement("div");
backgroundNode.style.position = "absolute";
backgroundNode.style.width = "100%";
backgroundNode.style.height = "100%";
backgroundNode.style.backgroundColor = "rgb(255, 255, 255)";
backgroundNode.style.opacity = "0.7";
backgroundNode.style.borderRadius = "20px";
backgroundNode.style.filter = "blur(2px)";

const textNode = document.createElement("div");
textNode.innerText = "Connecting";
textNode.style.position = "relative";
textNode.style.zIndex = "100";
textNode.style.marginLeft = NO_ICON_MARGIN;
textNode.style.marginRight = "10px";
textNode.style.marginTop = "5px";
textNode.style.marginBottom = "5px";

const indicatorNode = document.createElement("div");
indicatorNode.id = SPINNER_ID;
indicatorNode.style.position = "absolute";
indicatorNode.style.top = "0%";
indicatorNode.style.right = "0%";
indicatorNode.style.marginRight = "2%";
indicatorNode.style.marginTop = "2%";

export interface IndicatorParams {
  text: string;
  icon?: "spinner";
}

/**
 * Create with provided params and show indicator.
 *
 * @param text
 * @param icon
 */
export function showIndicator({ text, icon }: IndicatorParams) {
  hideIndicator();

  textNode.innerText = text;

  indicatorNode.appendChild(backgroundNode);
  indicatorNode.appendChild(textNode);

  if (!icon) {
    textNode.style.marginLeft = NO_ICON_MARGIN;
  }

  if (icon) {
    textNode.style.marginLeft = ICON_MARGIN;

    if (icon === "spinner") {
      indicatorNode.appendChild(spinner);
    }
  }

  document.body.appendChild(indicatorNode);
}

/**
 *
 */
export function hideIndicator() {
  // remove all child nodes.
  // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes#Remove_all_children_from_a_node
  while (indicatorNode.firstChild) {
    indicatorNode.removeChild(indicatorNode.firstChild);
  }

  if (document.body.contains(indicatorNode)) {
    document.body.removeChild(indicatorNode);
  }
}
