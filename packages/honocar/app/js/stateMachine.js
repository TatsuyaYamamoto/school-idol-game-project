let currentState = null;

export function to(stateEngine, params) {
  const nextState = stateEngine;
  const prevState = currentState;

  prevState && prevState["tearDown"]();

  // prevent to fire next state button.
  setTimeout(() => {
    nextState && nextState["init"](params);
  });

  currentState = nextState;
}
