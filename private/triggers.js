import fs from "fs/promises";
import config from "@proxtx/config";
import { resolve } from "path";

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

await loadTriggers();
