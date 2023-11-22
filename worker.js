import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/keep-markup/prism-keep-markup.js"
import "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.js"
import { insertFolds } from "./lib/fold.js"

let Prism = window.Prism
Prism.manual = true
Prism.hooks.add("before-all-elements-highlight", ({ elements }) => {
    if (elements[0].parentNode.className.includes("fold")) elements.forEach(insertFolds)
})
/**
 * 
 * @param {boolean} fold 
 * @param {boolean} lineno 
 * @param {string} text 
 * @param {"js"|"ts"|"html"|"css"} language 
 * @returns 
 */
export default async function process(fold, lineno, text, language) {
    switch (language) {
        case "js":
            import("https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.js")
            break
        default:
            break
    }

    console.log("✨ code-viewer")
    const elementPre = document.createElement("pre")
    elementPre.className = lineno ? `language-${language} line-numbers` : `language-${language}`
    if (fold) elementPre.className += " fold"

    const elementCode = document.createElement("code")
    elementCode.className = `language-${language}`
    elementCode.textContent = text

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