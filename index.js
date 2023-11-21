import worker from "./worker.js"

const template = document.createElement("template")
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles.css" />
    <pre class="line-num"><code></code></pre>
`
class CodeViewer extends HTMLElement {
  name = "Подсветка синтаксиса кода"
  input = {
    src: {
      name: {
        ru: "Код",
      },
      type: String,
      value: "",
    },
    fold: {
      name: {
        ru: "Свертки строк",
      },
      type: Boolean,
      value: false,
    },
    lineno: {
      name: {
        ru: "Номера строк",
      },
      type: Boolean,
      value: true,
    },
  }
  output = {
    dst: {
      name: {
        ru: "Код",
      },
      type: String,
      value: "",
    },
  }
  property = {}

  constructor() {
    super()
    this.root = this.attachShadow({ mode: "closed" })
    let clone = template.content.cloneNode(true)
    this._preview = clone.querySelector("code")
    this.root.appendChild(clone)
  }
  connectedCallback() {}
  attributeChangedCallback(attrName, oldValue, newValue) {}
  /**
   * @param {any} value
   */
  set state({ input, output, property }) {
    console.log(value)
    this.output = output
    this._preview.innerHTML = output.dst.value
  }
  send({
    fold = proto.input.fold.default,
    lineno = proto.input.lineno.default,
    src = proto.input.src.default,
    lang = "js",
  }) {
    worker(fold, lineno, src, lang).then((result) => {
      this._preview.innerHTML = result
      this.output.dst.value = result
      this.dispatchEvent(new CustomEvent("complete", { detail: result }))
    })
  }
  subscribe(cb) {
    this.addEventListener("complete", () => cb({ input: this.input, output: this.output, property: this.property }))
  }
}
customElements.define(proto.tag, CodeViewer)