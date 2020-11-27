const KEY = "honocar";
const initialState = JSON.stringify({
  character: "honoka",
});

function getRoot() {
  return JSON.parse(localStorage.getItem(KEY) || initialState);
}

function save(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getCharacter() {
  return getRoot().character;
}

export function setCharacter(character) {
  const current = getRoot();
  current.character = character;

  save(current);
}
