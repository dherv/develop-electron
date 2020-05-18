const readDirectoryFilenames = require("../../system/index")
  .readDirectoryFilenames;
const FolderList = require("./FolderList");

let template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {

    }
    #list::slotted(ul) {
      margin: 0;
      padding: 0;
      list-style-type: none;
      background-color: grey;
      list-style-type: none;
    }
    li {
      padding: 2rem 0;
    }
  </style>
  <aside>
    <slot name="list" id="list"></slot>
  </aside>
`;

class DevelopFolder extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("onOpenFolder", () => console.log("bubble"));
  }

  buildHTMLList(filenames) {
    const list = new FolderList(filenames);
    this.addEventListener("onOpenFolder", (event) => {
      // modify open folder if it comes from develop-folder to pass infos in the nav
      const nav = document.querySelector("nav");
      nav.textContent = event.detail.item;
    });

    list.setAttribute("slot", "list");
    this.appendChild(list);
  }

  connectedCallback() {
    readDirectoryFilenames()
      .then((filenames) => {
        console.log(filenames);
        this.buildHTMLList(filenames);
      })
      .catch((err) => {
        console.log("here");
        // removeColumn();
      });
  }
}

customElements.define("develop-folder", DevelopFolder);

module.exports = DevelopFolder;
