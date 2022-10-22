import fs from "fs/promises";
import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import { checkTrigger } from "./triggers.js";
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

const checkActionTriggers = async () => {
  for (let actionName in actions) {
    let action = actions[actionName];
    if (!action.trigger) continue;
    if (await checkTrigger(action.trigger)) {
      console.log("Triggered:", actionName);
      await runFlow(action.flow);
    }
  }
};

const runFlow = async (flow) => {
  await unifyGuiAPI.runFlow(config.unifyGuiAPI.pwd, flow);
};

const actionTriggerLoop = async () => {
  while (true) {
    try {
      await checkActionTriggers();
    } catch (e) {
      console.log("Action Trigger Check failed. Error:", e);
    }
    await new Promise((r) => setTimeout(r, 60000));
  }
};

export const getFlows = async () => {
  return await unifyGuiAPI.listFlows(config.unifyGuiAPI.pwd);
};

await loadActions();
actionTriggerLoop();
