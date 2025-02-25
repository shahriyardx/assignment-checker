import { type JsonData } from "./types"
import { kebabCase } from "lodash"
import { BASE_URL } from "./utils"

const getButton = (content: string) => {
  const btn = document.createElement("button")
  btn.style.border = "none"
  btn.style.paddingInline = "10px"
  btn.style.fontSize = "15px"
  btn.style.borderRadius = "10px"
  btn.textContent = content

  return btn
}

export const showJsonLoader = async () => {
  const loaderContainer = document.querySelector(".custom-table-component")
  const evalForm = document.querySelector(".assignment-evaluation-form")
  const assignmentModal = evalForm ? evalForm.parentElement : null

  if (!loaderContainer) return

  const importer = document.querySelector("#json-importer")
  if (importer) return importer.remove()

  const div = document.createElement("div")
  div.id = "json-importer"
  div.style.border = "2px solid black"
  div.style.borderRadius = "10px"
  div.style.padding = "10px"
  div.style.marginBottom = "10px"

  const html = `
        <div>
          <h3 style="margin-bottom: 10px; font-weight: bold; text-decoration: underline;">Loaded JSON</h3> 
          <div id="json-list" style="display: flex; flex-direction: column; margin-bottom: 10px;"></div>
          <input type="file" id="import-json-btn">

          <h3 style="margin-bottom: 10px; margin-top: 20px; font-weight: bold; text-decoration: underline;">Cloud JSON</h3> 
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <select class="form-control" id="json-batch-selector">
                <option value="" selected disabled>Select Batch</option>
              </select>
              <select class="form-control d-none" id="json-assignment-selector">
                <option value="" selected>Select Assignment</option>
              </select>
            </div>

            <div id="cloud-jsons" style="margin-top: 5px;"></div>
          <div>
        <div>
    `

  div.innerHTML = html

  const container = assignmentModal || loaderContainer
  container.insertAdjacentElement("afterbegin", div)

  const batchesResponse = await fetch(
    `${BASE_URL}/api/extension/batches`,
  )
  const batches = (await batchesResponse.json()) as {
    id: string
    name: string
  }[]

  const batchSelect = document.getElementById(
    "json-batch-selector",
  ) as HTMLSelectElement
  const assignmentSelect = document.getElementById(
    "json-assignment-selector",
  ) as HTMLSelectElement

  for (const batch of batches) {
    const batchOpt = document.createElement("option")
    batchOpt.value = batch.id
    batchOpt.textContent = batch.name

    batchSelect?.appendChild(batchOpt)
  }

  batchSelect.addEventListener("change", async (e: Event) => {
    const target = e.target as HTMLSelectElement
    const batchId = target.value

    const assignmentResponse = await fetch(
      `${BASE_URL}/api/extension/batches/${batchId}`,
    )
    const assignments = (await assignmentResponse.json()) as {
      id: string
      name: string
    }[]

    assignmentSelect.classList.remove("d-none")
    assignmentSelect.innerHTML = ""

    const defaultopt = document.createElement("option")
    defaultopt.value = ""
    defaultopt.textContent = "Select Assignment"
    defaultopt.selected = true
    defaultopt.disabled = true

    assignmentSelect.appendChild(defaultopt)

    for (const assignment of assignments) {
      const assOpt = document.createElement("option")
      assOpt.value = assignment.id
      assOpt.textContent = assignment.name

      assignmentSelect?.appendChild(assOpt)
    }
  })

  assignmentSelect.addEventListener("change", async (e: Event) => {
    const cloudList = document.getElementById("cloud-jsons")
    cloudList.innerHTML = ""

    const target = e.target as HTMLSelectElement
    const assignmentId = target.value

    const assignmentJsonResponse = await fetch(
      `${BASE_URL}/api/extension/assignments/${assignmentId}`,
    )
    const jsons = (await assignmentJsonResponse.json()) as {
      data: string
      assignment: { name: string }
      batch: { name: string }
      user: { name: string }
      category: string
    }[]

    for (const jsonIndex in jsons) {
      const json = jsons[Number(jsonIndex)]
      const jsonContainer = document.createElement("div")
      jsonContainer.style.display = "flex"
      jsonContainer.style.gap = "5px"
      jsonContainer.style.padding = "5px"
      jsonContainer.style.alignItems = "center"

      if (Number(jsonIndex) % 2 === 0) {
        jsonContainer.style.backgroundColor = "#f2f2f2"
      }

      const filename = kebabCase(
        `${json.batch.name} ${json.assignment.name} ${
          json.category ? `category ${json.category}` : ""
        }`,
      )

      const title = document.createElement("span")
      title.textContent = filename

      const downloadButton = document.createElement("button")
      downloadButton.textContent = "Download"
      downloadButton.style.marginLeft = "auto"
      downloadButton.style.backgroundColor = "green"
      downloadButton.style.color = "#fff"
      downloadButton.style.borderRadius = "5px"
      downloadButton.style.padding = "5px"
      downloadButton.addEventListener("click", () => {
        appendJson(json.data, filename)
      })

      jsonContainer.appendChild(title)
      jsonContainer.appendChild(downloadButton)

      cloudList?.append(jsonContainer)
    }
  })

  renderList()
  enableJsonLoader()
}

const getJsons = () => {
  const jsonsData = localStorage.getItem("assignment-jsons")
  const jsons: Array<JsonData> = jsonsData ? JSON.parse(jsonsData) : []

  return jsons
}

const renderList = async () => {
  const currentJsonData = localStorage.getItem("assignment-data")
  const jsons = getJsons()

  const currentJson: JsonData = currentJsonData
    ? JSON.parse(currentJsonData)
    : { filename: "null" }

  const jsonList = document.querySelector("#json-list")
  jsonList.innerHTML = ""

  for (const jsonIndex in jsons) {
    const json = jsons[Number(jsonIndex)]
    const jsonContainer = document.createElement("div")
    jsonContainer.style.display = "flex"
    jsonContainer.style.gap = "5px"
    jsonContainer.style.padding = "5px"

    if (Number(jsonIndex) % 2 === 0) {
      jsonContainer.style.backgroundColor = "#f2f2f2"
    }

    const title = document.createElement("span")
    title.textContent = json.filename

    const activeButton = getButton(
      currentJson.filename === json.filename ? "Active" : "Activate",
    )
    activeButton.style.backgroundColor =
      currentJson.filename === json.filename ? "#6807ff" : "#dddddd"
    activeButton.style.color =
      currentJson.filename === json.filename ? "white" : "black"
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

    reader.onload = () => {
      const filename = input.files ? input.files[0].name : null

      if (!filename) return
      const data = reader.result as string
      appendJson(data, filename)
    }

    if (input.files && input.files.length > 0) {
      reader.readAsText(input.files[0])
    }
  })
}

const appendJson = (data: string, filename: string) => {
  const jsonsData = localStorage.getItem("assignment-jsons")
  const jsons: Array<JsonData> = jsonsData ? JSON.parse(jsonsData) : []

  const filtered = jsons.filter((json) => json.filename !== filename)
  const jsonData = { filename, data: JSON.parse(data) }

  filtered.push(jsonData)

  localStorage.setItem("assignment-jsons", JSON.stringify(filtered))
  localStorage.setItem("assignment-data", JSON.stringify(jsonData))

  renderList()
}
