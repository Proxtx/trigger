let actions = await framework.load("actions.js");
let actionDefinitions = await actions.getActions(cookie.pwd);
let actionElem = document.getElementById("action");
let newButton = document.getElementById("newButton");
let contentWrap = document.getElementById("contentWrap");

const iframeSrc = await actions.getIframeSrc(cookie.pwd);

const applyActionDefinitions = (actionDefinitions) => {
  for (let name in actionDefinitions) {
    let elem = createActionFromDefinition(name, actionDefinitions[name]);
    contentWrap.insertBefore(elem, newButton);
  }
};

const createActionFromDefinition = (name, definition) => {
  let elem = actionElem.cloneNode(true);
  let nameInput = elem.getElementsByClassName("actionName")[0];
  nameInput.value = name;
  nameInput.addEventListener("change", async () => {
    await renameAction(name, nameInput.value, definition);
    name = nameInput.value;
  });

  let triggerText = elem.getElementsByClassName("triggerText")[0];
  triggerText.innerText = definition.trigger
    ? definition.trigger.text
    : "No Trigger Set";
  let triggerArrow = elem.getElementsByClassName("triggerArrow")[0];
  triggerArrow.addEventListener("click", () => {
    localStorage.actionName = name;
    location.pathname = "/trigger";
  });

  let loadButton = elem.getElementsByClassName("loadAction")[0];
  let actionIframe;

  loadButton.addEventListener("click", async () => {
    actionIframe = document.createElement("iframe");
    actionIframe.classList.add("actionCreatorIframe");
    actionIframe.width = "100%";
    actionIframe.height = "100%";
    actionIframe.src = iframeSrc;
    loadButton.parentElement.replaceChild(actionIframe, loadButton);
    await actionIframe.enableCombine("interaction");

    if (definition.action) actionIframe.combine.importAction(definition.action);

    let dimensions = await actionIframe.combine.size();
    actionIframe.style.height = dimensions.height + "px";

    while (true) {
      await actionIframe.combine.resizeObserver();
      let dimensions = await actionIframe.combine.size();
      actionIframe.style.height = dimensions.height + "px";
    }
  });

  let deleteButton = elem.getElementsByClassName("deleteButton")[0];
  deleteButton.addEventListener("click", async () => {
    await new Promise((r) => setTimeout(r, 500));
    await deleteAction(name);
    location.pathname = location.pathname;
  });

  let saveButton = elem.getElementsByClassName("saveButton")[0];
  saveButton.addEventListener("click", async () => {
    definition.action = await actionIframe.combine.getAction();
    await saveAction(name, definition);
  });

  return elem;
};

const deleteAction = async (name) => {
  await actions.deleteAction(cookie.pwd, name);
};

const renameAction = async (oldName, newName, definition) => {
  await actions.deleteAction(cookie.pwd, oldName);
  await actions.setAction(cookie.pwd, newName, definition);
};

const saveAction = async (name, definition) => {
  await actions.setAction(cookie.pwd, name, definition);
};

const applyOptionArray = async (elem, options) => {
  elem.innerHTML = "";
  for (let option of options) {
    let oElem = document.createElement("option");
    oElem.innerText = option;
    oElem.value = option;
    elem.appendChild(oElem);
  }
};

const createAction = async (name) => {
  await actions.setAction(cookie.pwd, name, {});
};

window.new = async () => {
  await new Promise((r) => setTimeout(r, 500));
  await createAction("New Action");
  location.pathname = location.pathname;
};

window.openLog = async () => {
  await new Promise((r) => setTimeout(r, 500));
  location.pathname = "actionLog";
};

applyActionDefinitions(actionDefinitions);
