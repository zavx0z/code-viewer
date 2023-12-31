const html = String.raw

export function nodeFabric(actor) {
  const template = document.createElement("template")
  template.innerHTML = html`
    <h1>${actor.name}</h1>
    <form>
      ${Object.entries(actor.input)
        .map(([key, socket]) => {
          switch (socket.type) {
            case "Boolean":
              return html`
                <div>
                  <input type="checkbox" id="${key}" name="${key}" ${socket.value ? "checked" : ""} />
                  <label for="${key}">${socket.name.ru}</label>
                </div>
              `
            case "String":
              return html`
                <div>
                  <label for="${key}">${socket.name.ru}</label>
                  <textarea cols="80" rows="4" id="${key}" name="${key}"> ${socket.value} </textarea>
                </div>
              `
            default:
              return ""
          }
        })
        .join("")}
    </form>
  `
  template.content.querySelector("form").addEventListener("change", (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const props = {}
    for (const key in actor.input) {
      const value = formData.get(key)
      if (actor.input[key].type === "Boolean") {
        props[key] = value === "on"
      } else props[key] = value
    }
    actor.send(props)
  })
  template.content.appendChild(actor)
  return template.content
}
