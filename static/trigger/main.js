const trigger = await framework.load("triggers.js");
const triggerConfig = document.getElementById("triggerConfig");

const save = async () => {
  let config = triggerConfig.component.getTriggerConfiguration();
  await trigger.setTrigger(cookie.pwd, localStorage.actionName, config);
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
