import { listen } from "@proxtx/framework";
import config from "@proxtx/config";
import * as _ from "./private/triggers.js";

await listen(config.port);
console.log("Server started. Port:", config.port);
