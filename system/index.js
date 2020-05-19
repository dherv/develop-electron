const fs = require("fs");
const os = require("os");
const path = require("path");

const homeDir = os.homedir();
const defaultFolderPath = path.join("Documents", "develop");
const defaultAbsolutePath = path.resolve(homeDir, defaultFolderPath);

// TODO: refactor promises with require('fs').promises
// const fs = require('fs').promises;

const checkDirectoryOrFile = async (path = defaultAbsolutePath) => {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) {
        reject(err);
      }
      const check = stats.isDirectory();
      resolve(check);
    });
  });
};
const readDirectoryFilenames = (path = defaultAbsolutePath) => {
  return new Promise(async (resolve, reject) => {
    const check = await checkDirectoryOrFile(path);
    if (check) {
      return fs.readdir(path, (err, files) => {
        if (err) {
          reject(err);
        }
        return resolve(files);
      });
    } else {
      reject(new Error("This is not a directory"));
    }
  });
};

const buildAbsolutePath = (filename) =>
  path.resolve(homeDir, path.join("Documents", filename));

module.exports = {
  readDirectoryFilenames: readDirectoryFilenames,
  buildAbsolutePath: buildAbsolutePath,
};
