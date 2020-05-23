const template = document.createElement("template");
template.innerHTML = `
<style>
  li {
    padding: 1rem 0;
    margin-bottom: 4px;
    background-color: yellow;
    cursor: pointer;
  }
</style>
<li>
  <slot></slot>
</li>
`;

class FolderListItem extends HTMLElement {
  constructor(filename, level) {
    super();
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.filename = filename;
    this.level = level;
  }
  connectedCallback() {
    const listItemText = document.createTextNode(this.filename);
    this.appendChild(listItemText);
    this.addEventListener("click", this._onClick);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
  }

  _onClick() {
    const onOpenFolder = new CustomEvent("onOpenFolder", {
      detail: {
        level: this.level,
        item: this.textContent,
        s: "color: red",
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(onOpenFolder);
  }
}

customElements.define("folder-list-item", FolderListItem);

module.exports = FolderListItem;
