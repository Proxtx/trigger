import { auth } from "../public/meta.js";
import config from "@proxtx/config";

let srcUrl = new URL(config.unifyGuiAPI.url);
srcUrl.pathname = "/actionCreator";
srcUrl = srcUrl.href;

export const server = async (document, options) => {
  if (!(await auth(options.req.cookies.pwd))) return;
  document
    .getElementsByClassName("actionCreatorIframe")[0]
    .setAttribute("src", srcUrl);
};
