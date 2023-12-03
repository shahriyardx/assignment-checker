import { config } from "./globals"

export const showJsonLoader = () => {
  const loaderContainer = document.querySelector(".custom-table-component")

  if (!config.setLoader && loaderContainer?.firstChild) {
    loaderContainer?.removeChild(loaderContainer.firstChild)
  } else {
    const div = document.createElement("div")
    div.style.border = "2px solid black"
    div.style.borderRadius = "10px"
    div.style.padding = "10px"
    div.style.marginBottom = "10px"

    const html = `
        <input type="file" id="import-json-btn">
    `

    div.innerHTML = html

    loaderContainer?.insertAdjacentElement("afterbegin", div)
  }
}
