import { triggers } from "../private/triggers.js";
import { auth } from "./meta.js";

export const listTriggers = async (pwd) => {
  if (!(await auth(pwd))) return;
  return Object.keys(triggers);
};

export const getTriggerGui = async (pwd, trigger) => {
  if (!(await auth(pwd))) return;
  return await triggers[trigger].getSelectionGui();
};
