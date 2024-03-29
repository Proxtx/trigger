import {
  triggers,
  checkTrigger as checkTriggerPrivate,
} from "../private/triggers.js";
import { auth } from "./meta.js";
import { getActions, saveActions } from "../private/actions.js";

export const listTriggers = async (pwd) => {
  if (!(await auth(pwd))) return;
  return Object.keys(triggers);
};

export const getTriggerGui = async (pwd, trigger) => {
  if (!(await auth(pwd))) return;
  return await triggers[trigger].getSelectionGui();
};

export const setTrigger = async (pwd, name, trigger) => {
  if (!(await auth(pwd))) return;
  getActions()[name].trigger = trigger;
  await saveActions();
};

export const getTrigger = async (pwd, name) => {
  if (!(await auth(pwd))) return;
  return getActions()[name].trigger;
};

export const checkTrigger = async (pwd, config) => {
  if (!(await auth(pwd))) return;
  return await checkTriggerPrivate(config);
};
