import {
  activateJson,
  addJsonFiles,
  getActiveFilename,
  getJsons,
  removeJson,
  subscribeToJsons,
} from "./json-store"
import { showNotice } from "./notice"
import { injectPanelStyles } from "./panel-styles"

const getButton = (content: string, className: string) => {
  const btn = document.createElement("button")
  btn.type = "button"
  btn.className = className
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

  injectPanelStyles()

  const div = document.createElement("div")
  div.id = "json-importer"
  div.className = "ac-panel"
  div.style.padding = "14px"
  div.style.marginBottom = "12px"

  div.innerHTML = `
        <div class="ac-label">Loaded <span class="ac-count" id="json-count">0</span></div>
        <div id="json-list" class="ac-list"></div>
        <input type="file" id="import-json-btn" class="ac-file" accept=".json,application/json" multiple>
        <p class="ac-hint">Pick one or more JSON files. The last one becomes active.</p>
    `

  const container = assignmentModal || loaderContainer
  container.insertAdjacentElement("afterbegin", div)

  renderList()
  enableJsonLoader()
}

const renderList = () => {
  const jsonList = document.querySelector("#json-list")
  if (!jsonList) return

  const jsons = getJsons()
  const activeFilename = getActiveFilename()

  jsonList.innerHTML = ""

  const count = document.querySelector("#json-count")
  if (count) count.textContent = String(jsons.length)

  if (jsons.length === 0) {
    const empty = document.createElement("div")
    empty.className = "ac-empty"
    empty.textContent = "Nothing loaded yet"
    jsonList.append(empty)
    return
  }

  for (const json of jsons) {
    const isActive = activeFilename === json.filename

    const jsonContainer = document.createElement("div")
    jsonContainer.className = isActive ? "ac-row is-active" : "ac-row"

    const title = document.createElement("span")
    title.className = "ac-row__name"
    title.textContent = json.filename
    title.title = json.filename

    const activeButton = getButton(
      isActive ? "Active" : "Activate",
      isActive ? "ac-btn ac-btn--on" : "ac-btn",
    )

    const removeButton = getButton("×", "ac-btn ac-btn--x")
    removeButton.title = `Remove ${json.filename}`

    activeButton.addEventListener("click", () => activateJson(json))
    removeButton.addEventListener("click", () => removeJson(json.filename))

    jsonContainer.appendChild(title)
    jsonContainer.appendChild(activeButton)
    jsonContainer.appendChild(removeButton)

    jsonList.append(jsonContainer)
  }
}

export const enableJsonLoader = () => {
  const el = document.getElementById("import-json-btn")

  if (!el) return

  el.addEventListener("change", async (e: Event) => {
    const input = e.target as HTMLInputElement
    const files = input.files ? Array.from(input.files) : []

    if (files.length === 0) return

    const rejected = await addJsonFiles(files)
    input.value = ""

    if (rejected.length > 0) {
      showNotice(`Not valid JSON: ${rejected.join(", ")}`, "error")
    }
  })
}

// the tools rail writes to the same store, so the panel follows along
subscribeToJsons(renderList)
