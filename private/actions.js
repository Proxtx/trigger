import fs from "fs/promises";
import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import { checkTrigger } from "./triggers.js";
import config from "@proxtx/config";

const api = await genCombine(config.apps, "public/api.js", genModule);

let actions;
export let log = [];

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
    (async () => {
      try {
        if (await checkTrigger(action.trigger, actionName)) {
          console.log("Triggered:", actionName);
          await runAction(action.action);
          log.push({
            time: Date.now(),
            actionName,
          });

          if (log.length > 30) {
            log.shift();
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }
};

const runAction = async (action) => {
  if (!action) return;
  return await api.execute(
    config.pwd,
    action.appName,
    action.method,
    action.arguments
  );
};

const actionTriggerLoop = async () => {
  while (true) {
    try {
      await checkActionTriggers();
    } catch (e) {
      console.log("Action Trigger Check failed. Error:", e);
    }
    await new Promise((r) =>
      setTimeout(
        r,
        config.triggerCheckInterval ? config.triggerCheckInterval : 60000
      )
    );
  }
};
await loadActions();
actionTriggerLoop();
