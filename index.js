import worker from "./worker.js"

const template = document.createElement("template")
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles.css" />
    <pre class="line-num"><code></code></pre>
`
class CodeViewer extends HTMLElement {
  name = "Подсветка синтаксиса кода"
  input = {
    src: { name: { ru: "Код", }, type: String, value: "" },
    fold: { name: { ru: "Свертки строк", }, type: Boolean, value: false },
    lineno: { name: { ru: "Номера строк", }, type: Boolean, value: true },
  }
  output = {
    dst: { name: { ru: "Код", }, type: String, value: "" },
  }
  property = {}

  constructor() {
    super()
    this.root = this.attachShadow({ mode: "closed" })
    let clone = template.content.cloneNode(true)
    this._preview = clone.querySelector("code")
    this.root.appendChild(clone)
  }
  connectedCallback() { }
  attributeChangedCallback(attrName, oldValue, newValue) { 
    console.log(attrName)
  }
  /**
   * @param {any} value
   */
  set state({ input, output, property }) {
    this.output = output
    this.input = input
    this.property = property
    this._preview.innerHTML = output.dst.value
  }
  send({
    fold = this.input.fold.default,
    lineno = this.input.lineno.default,
    src = this.input.src.default,
    lang = "js"
  }) {
    worker(fold, lineno, src, lang).then((result) => {
      this._preview.innerHTML = result
      this.input.fold.value = fold
      this.input.lineno.value = lineno
      this.input.src.value = src
      this.output.dst.value = result
      this.dispatchEvent(new CustomEvent("complete", { detail: result }))
    })
  }
  subscribe(cb) {
    this.addEventListener("complete", () => cb({ input: this.input, output: this.output, property: this.property }))
  }
}
customElements.define("code-viewer", CodeViewer)