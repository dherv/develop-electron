const FolderListItem = require("./FolderListItem");
const template = document.createElement("template");
template.innerHTML = `
<style>
  ul {
    margin: 0;
    padding: 0;
    list-style-type:none;
  }
</style>
<ul>
  <slot></slot>
</ul>
`;

class FolderList extends HTMLElement {
  constructor(filenames) {
    super();
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.filenames = filenames;
  }
  connectedCallback() {
    this.filenames.forEach((filename) => {
      const listItem = new FolderListItem(filename);
      this.appendChild(listItem);
    });
  }
}

customElements.define("folder-list", FolderList);

module.exports = FolderList;
