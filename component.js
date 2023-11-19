export const proto = {
    in: {},
    out: {},
    prop: {}
}

const template = document.createElement('template')
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="./styles.css" />
    <div>
        <h2>code-viewer</h2>
    </div>
`
class Component extends HTMLElement {
    constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: "closed" })
        let clone = template.content.cloneNode(true)
        shadowRoot.appendChild(clone)
    }
    static get observedAttributes() {
        return ["src", "dst"]
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case "src":
            case "dst":
            default:
                console.log(`attribute ${attrName} changed`)
        }
    }
    get src() { return this.getAttribute("src") }
    set src(value) { this.setAttribute("src", value) }
    get dst() { return this.getAttribute("dst") }
}
customElements.define("code-viewer", Component)

