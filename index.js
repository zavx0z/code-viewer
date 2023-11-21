import worker from "./worker.js"
import proto from "./proto.js"

const template = document.createElement("template")
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles.css" />
    <pre class="line-num"><code></code></pre>
`
class CodeViewer extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "closed" })
    let clone = template.content.cloneNode(true)
    this._preview = clone.querySelector("code")
    this.root.appendChild(clone)
  }
  static get observedAttributes() {
    return []
  }
  connectedCallback() {}
  attributeChangedCallback(attrName, oldValue, newValue) {}
  /**
   * @param {String} value
   */
  set preview(value) {
    this._preview.innerHTML = value
  }
  send({
    fold = proto.input.fold.default,
    lineno = proto.input.lineno.default,
    src = proto.input.src.default,
    lang = "js",
  }) {
    worker(fold, lineno, src, lang).then((result) => {
      this._preview.innerHTML = result
      this.dispatchEvent(new CustomEvent("complete", { detail: result }))
    })
  }
  subscribe(cb) {
    this.addEventListener("complete", ({ detail }) => cb(detail))
  }
}
customElements.define(proto.tag, CodeViewer)
export { proto }
