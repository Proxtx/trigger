export class Component {
  constructor(options) {
    this.document = options.shadowDom;

    this.triggerSelect = this.document.getElementById("triggerSelect");
    this.triggerGui = this.document.getElementById("triggerGui");
    this.continuousCheck = this.document.getElementById("continuousCheck");
    this.box = this.document.getElementById("box");

    this.prepareCall = this.prepare();
  }

  async prepare() {
    this.trigger = await framework.load("triggers.js");
    this.triggers = await this.trigger.listTriggers(cookie.pwd);
    this.applyOptionArray(this.triggerSelect, this.triggers);

    this.triggerSelect.addEventListener("change", () => {
      this.generateTriggerGui(this.triggerSelect.value);
    });

    this.triggerSelect.value = this.triggerSelect.children[0].value;
    this.generateTriggerGui(this.triggerSelect.value);
  }

  applyOptionArray(elem, options) {
    elem.innerHTML = "";
    for (let option of options) {
      let oElem = document.createElement("option");
      oElem.innerText = option;
      oElem.value = option;
      elem.appendChild(oElem);
    }
  }

  async generateTriggerGui(triggerName, config = null) {
    let guiData = await this.trigger.getTriggerGui(cookie.pwd, triggerName);
    if (config) this.continuousCheck.component.checked = config.continuous;
    this.triggerGui.innerHTML = guiData.html;
    let triggerGui = this.triggerGui;
    let triggerGuiData = guiData.data;
    let triggerPresetData = config ? config.data : null;
    let getTriggerConfiguration = (callback) => {
      this.getTriggerConfiguration = async () => {
        let config = await callback();
        config.trigger = this.triggerSelect.value;
        config.id = Math.floor(Math.random() * 100000);
        config.continuous = this.continuousCheck.component.checked;
        return config;
      };
    };
    eval(guiData.handler);
  }

  async loadConfig(config) {
    this.triggerSelect.value = config.trigger;
    this.generateTriggerGui(config.trigger, config);
  }
}
