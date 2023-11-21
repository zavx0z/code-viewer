export default {
    title: "Подсветка синтаксиса кода",
    tag: "code-viewer",
    input: {
      src: {
        title: {
          ru: "Код",
        },
        type: "Text",
        default: "",
      },
      fold: {
        title: {
          ru: "Свертки строк",
        },
        type: "Boolean",
        default: false,
      },
      lineno: {
        title: {
          ru: "Номера строк",
        },
        type: "Boolean",
        default: true,
      },
    },
    output: {
      dst: {
        title: {
          ru: "Код",
        },
        type: "Text",
        default: "",
      },
    },
  }