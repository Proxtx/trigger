import fs from "fs/promises";
import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import config from "@proxtx/config";

const unifyGuiAPI = await genCombine(
  config.unifyGuiAPI.url,
  "public/flow.js",
  genModule
);

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

export const flows = await unifyGuiAPI.listFlows(config.unifyGuiAPI.pwd);

await loadActions();
