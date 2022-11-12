import fs from "fs/promises";
import config from "@proxtx/config";
import { resolve } from "path";

let triggerIdResponses = {};

export let triggers = {};

export const loadTriggers = async () => {
  triggers = {};
  let triggerNames = await fs.readdir("triggers");
  for (let triggerName of triggerNames) {
    triggers[triggerName] = new (
      await import("../triggers/" + triggerName + "/main.js")
    ).Trigger(
      config[triggerName] ? config[triggerName] : {},
      resolve("triggers/" + triggerName) + "/"
    );
  }
};

export const checkTrigger = async (triggerConfig, actionName) => {
  if (!triggerConfig.trigger) return false;
  let trigger = triggers[triggerConfig.trigger];
  if (!trigger) return false;

  let triggerResponse = await trigger.triggers(
    triggerConfig.data,
    triggerConfig
  );
  let returnBool = triggerResponse;

  if (!triggerConfig.continuous) {
    if (triggerIdResponses[triggerConfig.id]) returnBool = false;
    else if (triggerResponse) returnBool = true;
  }

  triggerIdResponses[triggerConfig.id] = triggerResponse;

  return returnBool;
};

await loadTriggers();
