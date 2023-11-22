import worker from "./worker.js"

const template = Object.assign(document.createElement("template"), { innerHTML: /*html*/ ` <pre class="line-num"><code></code></pre> ` })

class CodeViewer extends HTMLElement {
  name = "Подсветка синтаксиса кода"
  input = {
    src: { name: { ru: "Код", }, type: "String", value: "" },
    lineno: { name: { ru: "Номера строк", }, type: "Boolean", value: true },
    fold: { name: { ru: "Свертки строк", }, type: "Boolean", value: false },
  }
  output = {
    dst: { name: { ru: "Код", }, type: String, value: "" },
  }
  property = {}
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: "closed" })
    shadow.innerHTML = /*html*/ `<link rel="stylesheet" type="text/css" href="./styles.css" />`
    this._preview = template.content.querySelector("code")
    shadow.appendChild(template.content)
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
  send({ fold = this.input.fold.default, lineno = this.input.lineno.default, src = this.input.src.default, lang = "js" }) {
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