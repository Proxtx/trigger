import * as _ from "/lib/guiLoader.js";

const trigger = await framework.load("triggers.js");
const triggerConfig = document.getElementById("triggerConfig");
let url = new URL(location.href);
let actionName = url.searchParams.get("actionName");

const save = async () => {
  let config = await triggerConfig.component.getTriggerConfiguration();
  await trigger.setTrigger(cookie.pwd, actionName, config);
};

const back = () => {
  location.pathname = "../actions/";
};

window.back = async () => {
  await new Promise((r) => setTimeout(r, 500));
  back();
};

window.save = async () => {
  await new Promise((r) => setTimeout(r, 500));
  await save();
  back();
};

let triggerConfigPreset = await trigger.getTrigger(cookie.pwd, actionName);

await uiBuilder.ready(triggerConfig);

if (triggerConfigPreset)
  triggerConfig.component.loadConfig(triggerConfigPreset);
