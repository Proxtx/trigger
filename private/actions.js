import fs from "fs/promises";

let actions;

const loadActions = async () => {
  actions = JSON.parse(await fs.readFile("actions.json", "utf8")).actions;
};

export const getActions = () => {
  return actions;
};

export const saveActions = async () => {
  let currentActions = JSON.parse(await fs.readFile("actions.json", "utf8"));
  currentActions.actions = actions;
  await fs.writeFile("actions.json", JSON.stringify(currentActions));
};

await loadActions();
