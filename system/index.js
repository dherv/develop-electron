const fs = require("fs");
const os = require("os");
const path = require("path");

const homeDir = os.homedir();
const defaultFolderPath = path.join("Documents", "develop");
const defaultAbsolutePath = path.resolve(homeDir, defaultFolderPath);

const readDirectoryFilenames = (path = defaultAbsolutePath) => {
  return new Promise((resolve, reject) => {
    return fs.readdir(path, (err, files) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      return resolve(files);
    });
  });
};

const buildAbsolutePath = (filename) =>
  path.resolve(homeDir, path.join("Documents", "develop", filename));

module.exports = {
  readDirectoryFilenames: readDirectoryFilenames,
  buildAbsolutePath: buildAbsolutePath,
};
