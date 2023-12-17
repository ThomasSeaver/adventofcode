const fs = require("fs");
const dayDirectories = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((file) => file.isDirectory())
  .map((directory) => directory.name)
  .sort((a, b) => parseInt(b.split("day")[1] - a.split("day")[1]));

require(`./${dayDirectories[0]}/script.js`);
