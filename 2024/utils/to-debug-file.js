const fs = require("fs");

const toDebugFile = (data) =>
  fs.writeFileSync("debug.txt", data, (error) => (error ? console.error("error output: ", error) : null));

module.exports = { toDebugFile };
