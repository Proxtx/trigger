import { auth } from "./meta.js";
import {
  getActions as getActionsExport,
  saveActions,
  log,
} from "../private/actions.js";

export const getActions = async (pwd) => {
  if (!(await auth(pwd))) return;
  return getActionsExport();
};

export const setAction = async (pwd, actionName, action) => {
  if (!(await auth(pwd))) return;
  getActionsExport()[actionName] = action;
  await saveActions();
};

export const deleteAction = async (pwd, actionName) => {
  if (!(await auth(pwd))) return;
  delete getActionsExport()[actionName];
  await saveActions();
};

export const getLog = async (pwd) => {
  if (!(await auth(pwd))) return;
  return log;
};
