let currentState = null;

export function to(stateEngine, params) {
  const nextState = stateEngine;
  const prevState = currentState;

  prevState && prevState["tearDown"]();
  nextState && nextState["init"](params);

  currentState = nextState;
}
