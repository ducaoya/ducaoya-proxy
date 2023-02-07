const fs = require("fs");
const path = require("path");

const logs = [];
const max = 1000;

const logPath = path.join(__dirname, "/log.json");

/** 添加日志 */
function pushLog(log) {
  logs.unshift(log);

  if (logs.length > max) {
    logs.pop();
  }

  console.log(logPath, logs);

  fs.writeFile(logPath, JSON.stringify(logs), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function cleanLog() {
  logs = [];
}

module.exports = {
  pushLog,
  cleanLog,
};
