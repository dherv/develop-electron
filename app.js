const readDirectoryFilenames = require("./system/system")
  .readDirectoryFilenames;
const buildAbsolutePath = require("./system/system").buildAbsolutePath;
const FolderList = require("./ui/components/FolderList");
const VisualStudioIcon = require("./ui/components/VisualStudioIcon");
let currentFolderPath = [];

const App = function () {};

App.prototype.removeColumns = (length) => {
  let columns = Array.from(document.querySelectorAll("folder-list"));
  let columsSlice = columns.slice(length);
  columsSlice.forEach((c) => {
    const parent = c.parentNode;
    parent.removeChild(c);
  });
};

// using arrow function will bound this inside the prototype to the global object
App.prototype.init = function () {
  const addDevelopColumn = (filenames) => {
    const column = new FolderList(filenames, currentFolderPath.length - 1);
    const container = document.querySelector("#develop-folder");
    container.appendChild(column);
  };

  const developFolder = () => {
    currentFolderPath.push("develop");
    const path = buildAbsolutePath(`${currentFolderPath.join("/")}`);

    return readDirectoryFilenames(path).then((filenames) => {
      return addDevelopColumn(filenames);
    });
  };

  developFolder();

  const back = () => {
    if (currentFolderPath.length > 1) {
      currentFolderPath = currentFolderPath.slice(
        0,
        currentFolderPath.length - 1
      );
      if (currentFolderPath.length === 1) {
        this.navReset();
      }
      this.removeColumns(-1);
    }
  };
  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", back);
};

App.prototype.showVisualStudioIcon = function (path) {
  const nav = document.querySelector("nav");
  const icon = new VisualStudioIcon(path);
  const container = document.createElement("div");
  container.id = "nav-icon-container";
  container.appendChild(icon);
  nav.appendChild(container);
};

App.prototype.navReset = function () {
  const container = document.getElementById("nav-icon-container");
  const icon = container.querySelector("visual-studio-icon");
  container.removeChild(icon);

  const nav = document.querySelector("nav");
  const title = document.getElementById("nav-title-container");
  nav.removeChild(title);
};

App.prototype.navUpdate = function (text, path) {
  console.log({ text, path });
  const nav = document.querySelector("nav");
  nav.textContent = "";
  const title = document.createTextNode(text);
  const titleContainer = document.createElement("h5");
  titleContainer.id = "nav-title-container";

  titleContainer.appendChild(title);
  nav.appendChild(titleContainer);
  // should show the visual icon
  this.showVisualStudioIcon(path);
};

App.prototype.initEvents = function () {
  document.addEventListener("onOpenFolder", (event) => {
    const clickedColumn = event.detail.level;

    // update path
    // slice out items after
    const maxIndex = clickedColumn + 1;
    let folderPath = currentFolderPath.slice(0, maxIndex);

    // update UI
    this.removeColumns(maxIndex);

    folderPath = [...folderPath, event.detail.item];
    currentFolderPath = folderPath;

    // get the filenames
    const path = buildAbsolutePath(`${currentFolderPath.join("/")}`);

    // replace title and icon
    if (event.detail.level === 0) {
      this.navUpdate(event.detail.item, path);
    }

    readDirectoryFilenames(path)
      .then((filenames) => {
        // add new item
        const column = new FolderList(filenames, currentFolderPath.length - 1);
        const appGrid = document.getElementById("app-grid");
        appGrid.appendChild(column);
      })
      .catch((err) => console.error(err));
  });
};

module.exports = App;
