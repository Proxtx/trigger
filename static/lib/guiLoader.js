window.guiLoaded = [];

import { loadPack } from "/modules/uibuilder/main.js";

await loadPack("/modules/material/components/pack.json", {
  urlPrefix: "/modules/material/",
});

for (let i of guiLoaded) {
  i();
}

window.guiLoaded = null;
