import fs from "fs/promises";
import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import { checkTrigger } from "./triggers.js";
import config from "@proxtx/config";

const unifyGuiAPI = await genCombine(
  config.unifyGuiAPI.url,
  "public/api.js",
  genModule
);

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

let currentlyChecking = {};

const checkActionTriggers = async () => {
  for (let actionName in actions) {
    let action = actions[actionName];
    if (!action.trigger) continue;
    (async () => {
      if (currentlyChecking[action.trigger.id]) return;
      currentlyChecking[action.trigger.id] = true;
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

        currentlyChecking[action.trigger.id] = false;
      } catch (e) {
        console.log(e);
        currentlyChecking[action.trigger.id] = false;
      }
    })();
  }
};

const runAction = async (action) => {
  if (!action) return;
  return await unifyGuiAPI.execute(
    config.unifyGuiAPI.pwd,
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
