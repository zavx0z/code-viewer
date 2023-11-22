if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
  await import("//cdn.jsdelivr.net/npm/eruda")
  eruda.init({
    default: {
      displaySize: 40,
      transparency: 1,
      theme: "Material Oceanic",
    },
  })
  if (localStorage.getItem("eruda-active") === "true") eruda.show()
  eruda._entryBtn._$el[0].addEventListener("click", (event) => {
    setTimeout(() => {
      localStorage.setItem(
        "eruda-active",
        eruda._$el[0].children[0].style.display === "block" ? "true" : "false"
      )
    }, 300)
  })
}


