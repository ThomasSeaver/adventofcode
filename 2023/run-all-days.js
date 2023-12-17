const fs = require("fs");
const dayDirectories = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((file) => file.isDirectory())
  .map((file) => file.name)
  .sort((a, b) => parseInt(a.split("day")[1] - b.split("day")[1]));
dayDirectories.forEach((dayDirectory) => {
  console.log("Day", dayDirectory.split("day")[1]);
  require(`./${dayDirectory}/script.js`);
});
