import worker from "./worker.js"
import proto from "./proto.js"

const template = document.createElement("template")
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles/styles.css" />
    <link rel="stylesheet" type="text/css" href="./styles/prism.css" />
    <link rel="stylesheet" type="text/css" href="./styles/linenum.css" />
    <pre class="line-num"><code></code></pre>
`
customElements.define(
  proto.tag,
  class extends HTMLElement {
    constructor() {
      super()
      this.root = this.attachShadow({ mode: "closed" })
      let clone = template.content.cloneNode(true)
      this.result = clone.querySelector("code")
      this.root.appendChild(clone)
    }
    static get observedAttributes() {
      return ["src", "lineno", "fold", "dst"]
    }
    connectedCallback() {
      if (this.src) {
        setTimeout(() => console.log("connectedCallback"), 1000)
        worker(this.fold, this.lineno, this.src, "js")
          .then((result) => (this.dst = result))
          .then(() => this.dispatchEvent(new CustomEvent("complete", { detail: this.dst })))
      }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
      // console.log("attributeChangedCallback", attrName)
      if (attrName === "dst") {
        // console.log(oldValue, newValue)
      }
      if (oldValue !== newValue && attrName !== "dst") {
        console.log(attrName, oldValue, newValue, oldValue !== newValue)

        worker(this.fold, this.lineno, this.src, "js")
          .then((result) => (this.dst = result))
          .then(() => this.dispatchEvent(new CustomEvent("complete", { detail: this.dst })))
      }
    }
    get src() {
      return this.getAttribute("src")
    }
    set src(value) {
      this.setAttribute("src", value)
    }
    get lineno() {
      return this.getAttribute("lineno") === "true"
    }
    set lineno(value) {
      this.setAttribute("lineno", value)
    }
    get fold() {
      return this.getAttribute("fold") === "true"
    }
    set fold(value) {
      this.setAttribute("fold", value)
    }
    get dst() {
      return this.getAttribute("dst")
    }
    set dst(value) {
      this.result.innerHTML = value
      this.setAttribute("dst", value)
    }
  }
)
export { proto }
