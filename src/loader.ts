import { JsonData } from "./types"

const getButton = (content: string) => {
  const btn = document.createElement("button")
  btn.style.border = "none"
  btn.style.paddingInline = "10px"
  btn.style.fontSize = "15px"
  btn.style.borderRadius = "10px"
  btn.textContent = content

  return btn
}

export const showJsonLoader = () => {
  const loaderContainer = document.querySelector(".custom-table-component")
  const evalForm = document.querySelector(".assignment-evaluation-form")
  const assignmentModal = evalForm ? evalForm.parentElement : null

  if (!loaderContainer) return
  let importer

  if (assignmentModal) {
    importer = assignmentModal.querySelector("#json-importer")
  } else {
    importer = loaderContainer.querySelector("#json-importer")
  }

  if (importer) {
    return assignmentModal
      ? assignmentModal.removeChild(importer)
      : loaderContainer.removeChild(importer)
  }

  const div = document.createElement("div")
  div.id = "json-importer"
  div.style.border = "2px solid black"
  div.style.borderRadius = "10px"
  div.style.padding = "10px"
  div.style.marginBottom = "10px"

  const html = `
        <div id="json-list" style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;"></div>
        <input type="file" id="import-json-btn">
    `

  div.innerHTML = html

  const container = assignmentModal || loaderContainer
  container.insertAdjacentElement("afterbegin", div)
  renderList()
}

const getJsons = () => {
  const jsonsData = localStorage.getItem("assignment-jsons")
  const jsons: Array<JsonData> = jsonsData ? JSON.parse(jsonsData) : []

  return jsons
}

const renderList = () => {
  const currentJsonData = localStorage.getItem("assignment-data")
  const jsons = getJsons()

  const currentJson: JsonData = currentJsonData
    ? JSON.parse(currentJsonData)
    : { filename: "null" }

  const jsonList = document.querySelector("#json-list")

  if (jsonList) {
    while (jsonList.firstChild) {
      jsonList.removeChild(jsonList.firstChild)
    }

    const listTitle = document.createElement("h4")
    listTitle.textContent = "Loaded Jsons"
    listTitle.style.marginBottom = "5px"
    listTitle.style.fontWeight = "bold"

    jsonList?.append(listTitle)
  }

  for (let json of jsons) {
    const jsonContainer = document.createElement("div")
    jsonContainer.style.display = "flex"
    jsonContainer.style.gap = "5px"

    const title = document.createElement("span")
    title.textContent = json.filename

    const activeButton = getButton(
      currentJson.filename == json.filename ? "Active" : "Activate"
    )
    activeButton.style.backgroundColor =
      currentJson.filename == json.filename ? "#6807ff" : "#dddddd"
    activeButton.style.color =
      currentJson.filename == json.filename ? "white" : "black"
    activeButton.style.marginLeft = "auto"

    const removeButton = getButton("×")
    removeButton.style.backgroundColor = "#dddddd"
    removeButton.style.marginLeft = "5px"

    activeButton.addEventListener("click", () => {
      localStorage.setItem("assignment-data", JSON.stringify(json))
      renderList()
    })

    removeButton.addEventListener("click", () => {
      const filtered = jsons.filter((j) => json.filename !== j.filename)
      localStorage.setItem("assignment-jsons", JSON.stringify(filtered))
      renderList()
    })

    jsonContainer.appendChild(title)
    jsonContainer.appendChild(activeButton)
    jsonContainer.appendChild(removeButton)

    jsonList?.append(jsonContainer)
  }
}

export const enableJsonLoader = () => {
  const el = document.getElementById("import-json-btn")

  if (!el) return

  el.addEventListener("change", (e: Event) => {
    const input = e.target as HTMLInputElement
    const reader = new FileReader()

    reader.onload = function () {
      const jsonsData = localStorage.getItem("assignment-jsons")
      const jsons: Array<JsonData> = jsonsData ? JSON.parse(jsonsData) : []

      const filename = input.files ? input.files[0].name : null

      if (!filename) return
      const data = reader.result as string
      const filtered = jsons.filter((json) => json.filename !== filename)
      const jsonData = { filename, data: JSON.parse(data) }

      filtered.push(jsonData)

      localStorage.setItem("assignment-jsons", JSON.stringify(filtered))
      localStorage.setItem("assignment-data", JSON.stringify(jsonData))

      renderList()
    }

    if (input.files && input.files.length > 0) {
      reader.readAsText(input.files[0])
    }
  })
}
