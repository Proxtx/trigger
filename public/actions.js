import { auth } from "./meta.js";
import {
  getActions as getActionsExport,
  saveActions,
  log,
} from "../private/actions.js";
import config from "@proxtx/config";

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

export const getIframeSrc = async (pwd) => {
  if (!(await auth(pwd))) return;

  let srcUrl = new URL(config.guiUrl);
  srcUrl.pathname = "/actionCreator";
  srcUrl = srcUrl.href;

  return srcUrl;
};
