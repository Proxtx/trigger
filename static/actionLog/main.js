let actions = await framework.load("actions.js");
const content = document.getElementsByClassName("listContent")[0];

const createLog = (logData) => {
  let box = document.createElement("div");
  box.classList.add("box");
  let title = document.createElement("m-text");
  let bold = document.createElement("b");
  bold.innerText = logData.actionName;
  title.appendChild(bold);
  box.appendChild(title);
  let date = document.createElement("m-text");
  date.innerText = new Date(logData.time).toLocaleString();
  box.appendChild(date);
  let result = document.createElement("m-text");
  result.innerText = logData.result;
  box.appendChild(result);

  return box;
};

const createLogs = async () => {
  let logs = await actions.getLog(cookie.pwd);
  logs.reverse();
  for (let log of logs) {
    content.appendChild(createLog(log));
  }
};

createLogs();
