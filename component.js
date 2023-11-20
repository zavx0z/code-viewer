import worker from "./js/worker.js"
export const proto = {
  input: {},
  output: {},
  prop: {},
}
const template = document.createElement("template")
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles/styles.css" />
    <link rel="stylesheet" type="text/css" href="./styles/prism.css" />
    <link rel="stylesheet" type="text/css" href="./styles/linenum.css" />
    <pre class="line-num"><code></code>
    </div>
`
class Component extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "closed" })
    let clone = template.content.cloneNode(true)

    this.result = clone.querySelector("code")
    const src = this.getAttribute("src")

    if (src) worker(false, true, src, "js").then((result) => (this.result.innerHTML = result))

    this.root.appendChild(clone)
  }
  static get observedAttributes() {
    return ["src", "dst"]
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case "src":
        if (oldValue !== newValue) {
          worker(false, true, newValue, "js").then((result) => {
            this.result.innerHTML = result
            this.setAttribute("dst", result)
          })
        }
        break
      case "dst":
        if (oldValue !== newValue) this.dispatchEvent(new CustomEvent("output", { detail: newValue }))
        break
      default:
        console.log(`attribute ${attrName} changed`)
    }
  }
  get src() {
    return this.getAttribute("src")
  }
  set src(value) {
    this.setAttribute("src", value)
  }
  get dst() {
    return this.getAttribute("dst")
  }
}
customElements.define("code-viewer", Component)
