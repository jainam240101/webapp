const fs = require("fs");
const path = require("path");

const directoryPath = __dirname;

const files = fs.readdirSync(directoryPath);

files.forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const moduleName = path.parse(file).name;
    exports[moduleName] = require(`./${file}`);
  }
});
