// inspects code elements from prism during pre-render hook. if it's JS or JSON we try to insert details/summary tags to
// allow code folding
const lastLineWrapperOpen = ["<span class='ll'>"] // wrap portion of last line preceding the closing symbol so we can conditionally hide it, needed to make non-square hidden regions collapse nicely.
const lastLineWrapperClose = ["</span>"]
const firstLineContentWrapperOpen = ["<span class='fl'>"] // wrapper beginning at first **visible** character on first line where opening symbol is found. needed so we can align opening toggle nicely
const firstLineContentWrapperClose = ["</span>"]
const detailsOpenFragmentActive = ["<details open><summary>"]
// const detailsOpenFragmentActive = ["<details><summary>"]
const detailsOpenFragmentInactive = ["<details><summary>"]
const summaryCloseFragment = ["</summary>"]
const detailsCloseFragment = ["</details>"]
const symbolPairMap = {
    "{": "}",
    "[": "]",
}
function insertFold(inputBuffer, depth, context) {
    const output = []
    let remaining = inputBuffer
    let current
    function createFold(symbol) {
        const [result, resultRemaining] = insertFold(remaining, depth + 1, context)
        const currentLineEndIndex = result.indexOf("\n")
        // only create fold if symbol pair crossed a '\n'. only insert fold if at required depth.
        if (currentLineEndIndex >= 0 && depth >= context.minimumDepth) {
            const currentLineStartIndex = output.lastIndexOf("\n")
            const currentLineStart = output.splice(currentLineStartIndex + 1)
            const currentLineCharacterStartIndex = currentLineStart.findIndex((c) => /[^\s]{1}/.test(c))
            const currentLineStartWhiteSpace = currentLineStart.splice(0, currentLineCharacterStartIndex)
            const currentLineEnd = result.splice(0, currentLineEndIndex)
            const resultLastLineIndex = result.lastIndexOf("\n")
            const resultLastLine = result.splice(resultLastLineIndex + 1)
            output.push(
                ...(context.lineCount >= 40 ? detailsOpenFragmentInactive : detailsOpenFragmentActive),
                ...currentLineStartWhiteSpace,
                ...firstLineContentWrapperOpen,
                ...currentLineStart,
                ...currentLineEnd,
                ...firstLineContentWrapperClose,
                ...summaryCloseFragment,
                ...result,
                ...detailsCloseFragment,
                ...lastLineWrapperOpen,
                ...resultLastLine,
                ...lastLineWrapperClose,
                symbolPairMap[symbol],
            )
            remaining = resultRemaining
        } else {
            output.push(...result, symbolPairMap[symbol])
            remaining = resultRemaining
        }
    }
    while ((current = remaining.shift()) !== undefined) {
        switch (current) {
            case "[":
            case "{":
                output.push(current)
                createFold(current)
                break
            case "]":
            case "}":
                return [output, remaining]
            default:
                output.push(current)
        }
    }
    return [output, remaining]
}
export function insertFolds(codeElement) {
    const parseable = Array.from(codeElement.classList).find((cls) => cls.endsWith("json") || cls.endsWith("js") || cls.endsWith("javascript")) !== undefined
    if (parseable) {
        const inputBuffer = codeElement.innerText.split("")
        const [result] = insertFold(inputBuffer, 1, { minimumDepth: 2, lineCount: inputBuffer.filter((c) => c === "\n").length })
        codeElement.innerHTML = result.join("")
    }
}
// Prism.hooks.add("before-all-elements-highlight", ({ elements }) => elements.forEach(insertFolds))
