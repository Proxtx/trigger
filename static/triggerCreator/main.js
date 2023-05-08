import * as _ from "../lib/guiLoader.js";

const trigger = document.getElementById("triggerConfig");
await trigger.component.prepareCall;
trigger.component.box.style.boxShadow = "none";

export const getTriggerConfig = async () => {
  return await trigger.component.getTriggerConfiguration();
};

export const size = async () => {
  return trigger.getBoundingClientRect();
};

export const setTriggerConfig = async (triggerConfig) => {
  await trigger.component.loadConfig(triggerConfig);
};

let resolve;

export const resizeObserver = async () => {
  await new Promise((r) => {
    resolve = r;
  });
};

new ResizeObserver(() => {
  resolve && resolve();
}).observe(trigger.component.box);
