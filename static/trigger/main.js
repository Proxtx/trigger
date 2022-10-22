const trigger = await framework.load("triggers.js");
const triggers = await trigger.listTriggers(cookie.pwd);

const triggerSelect = document.getElementById("triggerSelect");
const triggerGui = document.getElementById("triggerGui");
window.triggerGui = triggerGui;

const applyOptionArray = async (elem, options) => {
  elem.innerHTML = "";
  for (let option of options) {
    let oElem = document.createElement("option");
    oElem.innerText = option;
    oElem.value = option;
    elem.appendChild(oElem);
  }
};

const generateTriggerGui = async (triggerName) => {
  let guiData = await trigger.getTriggerGui(cookie.pwd, triggerName);
  triggerGui.innerHTML = guiData.html;
  window.triggerGuiData = guiData.data;
  eval(guiData.handler);
};

const save = async () => {
  let config = window.getTriggerConfiguration();
  config.trigger = triggerSelect.value;
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

triggerSelect.addEventListener("change", () => {
  generateTriggerGui(triggerSelect.value);
});

applyOptionArray(triggerSelect, triggers);
triggerSelect.value = triggerSelect.children[0].value;
generateTriggerGui(triggerSelect.value);
