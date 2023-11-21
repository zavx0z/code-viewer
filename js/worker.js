import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.js"
import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/keep-markup/prism-keep-markup.js"
import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.js"
import { insertFolds } from "./fold.js"

let Prism = window.Prism
Prism.manual = true
Prism.hooks.add("before-all-elements-highlight", ({ elements }) => {
    if (elements[0].parentNode.className.includes("fold")) elements.forEach(insertFolds)
})

export default async function process(fold, lineno, text, language) {
    console.log("Proccess code-viewer")
    const elementPre = document.createElement("pre")
    elementPre.className = `language-${language}`
    if (lineno) elementPre.className += " line-numbers"
    if (fold) elementPre.className += " fold"

    const elementCode = document.createElement("code")
    elementCode.className = `language-${language}`
    elementCode.textContent = text.trimStart()

    elementPre.appendChild(elementCode)
    document.body.appendChild(elementPre)

    return new Promise((resolve, reject) => {
        try {
            Prism.highlightAllUnder(elementPre, false, () => {
                const result = elementCode.innerHTML
                document.body.removeChild(elementPre)
                resolve(result)
            })
        } catch (err) {
            reject(JSON.stringify(err))
        }
    })
}
