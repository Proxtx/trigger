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

triggerSelect.addEventListener("change", () => {
  generateTriggerGui(triggerSelect.value);
});

applyOptionArray(triggerSelect, triggers);
triggerSelect.value = triggerSelect.children[0].value;
generateTriggerGui(triggerSelect.value);
