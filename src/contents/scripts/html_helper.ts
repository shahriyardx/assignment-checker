import { insertFeedback, insertFeedbackCode } from "./feedback"
import type { CodeJson, Requirement, Section, SubRequirement } from "./types"
import { getJsonData } from "./utils"


const getCustomFeedbackEl = (uniqueId: string) => {
  const customFeedback = document.createElement("div")
  customFeedback.id = `${uniqueId}_custom_feedback`
  customFeedback.style.display = "none"
  customFeedback.style.gridTemplateColumns = "1fr 1fr"
  customFeedback.style.gap = "5px"
  customFeedback.style.paddingInline = "12px"
  customFeedback.style.paddingBottom = "10px"

  const cfHtml = `
      <input type="text" class="cf" placeholder="Custom Feedback">
      <input type="number" class="cn" placeholder="Partial Marks">
    `

  customFeedback.innerHTML = cfHtml

  return customFeedback
}

export const getInputChecked = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement
  return input?.checked
}

const showCustomFeedbackEl = (event: Event) => {
  const target = event.target as HTMLInputElement
  const display = target.checked ? "none" : "grid"

  const cf = document.getElementById(`${target.id}_custom_feedback`)
  if (cf) {
    cf.style.display = display
  }
}

const createReqContainer = () => {
  const el = document.createElement("div")
  el.classList.add("requirement-handler")
  el.style.display = "grid"
  el.style.gap = "10px"
  el.style.gridTemplateColumns = "auto 20px"

  return el
}

const createCheckInput = (uniqueId: string) => {
  const container = document.createElement("div")
  const input = document.createElement("input")
  input.type = "checkbox"
  input.setAttribute("data-reqindex", uniqueId)
  input.setAttribute("id", uniqueId)
  input.setAttribute("checked", "yes")
  input.addEventListener("change", (e) => showCustomFeedbackEl(e))

  container.appendChild(input)

  return container
}

const createLabel = (textContent: string, htmlFor: string) => {
  const label = document.createElement("label")
  label.textContent = textContent
  label.htmlFor = htmlFor

  return label
}

const wrap = (
  abbr: string,
  elements: Array<Element>,
  properties: Record<string, any> = {},
) => {
  const el = document.createElement(abbr)
  for (const [key, val] of Object.entries(properties)) {
    el.setAttribute(key, val)
  }

  for (const item of elements) {
    el.appendChild(item)
  }

  return el
}

const appendChild = (container: Element, childs: Array<Element>) => {
  for (const child of childs) {
    container.appendChild(child)
  }
}

const createSubrequirement = (
  requirements: SubRequirement[],
  reqIndex: number,
  sectionIndex: number,
) => {
  const reqContainer = document.createElement("div")
  reqContainer.classList.add("sub-requirements-container")
  reqContainer.style.paddingLeft = "3px"
  reqContainer.style.paddingRight = "15px"

  for (const subReqIndex in requirements) {
    const subReq = requirements[subReqIndex]
    const subRequirement = createReqContainer()

    const uniqueId = `${sectionIndex}_${reqIndex}_${subReqIndex}`
    const cf = getCustomFeedbackEl(uniqueId)

    const reqTitle = createLabel(
      `└─ ${subReq.description} (${subReq.number})`,
      uniqueId,
    )

    appendChild(subRequirement, [reqTitle, createCheckInput(uniqueId)])
    reqContainer.appendChild(
      wrap("div", [subRequirement, cf], {
        class: "single-requirement",
      }),
    )
  }

  return reqContainer
}

const createRequirement = (
  requirement: Requirement,
  reqIndex: number,
  sectionIndex: number,
) => {
  const reqContainer = document.createElement("div")
  reqContainer.classList.add("requirement")

  const mainRequirement = createReqContainer()

  const uniqueId = `${sectionIndex}_${reqIndex}`
  const cf = getCustomFeedbackEl(uniqueId)

  const reqTitle = createLabel(
    `${reqIndex + 1}. ${requirement.data.description} (${
      requirement.data.number
    })`,
    uniqueId,
  )

  appendChild(mainRequirement, [reqTitle, createCheckInput(uniqueId)])
  reqContainer.appendChild(
    wrap("div", [mainRequirement, cf], {
      class: "single-requirement",
    }),
  )

  const subRequirements = createSubrequirement(
    requirement.subRequirements,
    reqIndex,
    sectionIndex,
  )

  if (subRequirements) {
    reqContainer.appendChild(subRequirements)
  }

  return reqContainer
}

const createSection = (section: Section, sectionIndex: number) => {
  const sectionContainer = document.createElement("div")
  sectionContainer.style.marginBottom = "20px"
  sectionContainer.id = section.name
  const sectionTitle = document.createElement("h4")
  sectionTitle.textContent = section.name
  sectionTitle.style.padding = "5px"
  sectionTitle.style.borderRadius = "10px"
  sectionTitle.style.background = "#b9b9b9"
  sectionTitle.style.color = "white"

  sectionContainer.appendChild(sectionTitle)
  const requirementsContainer = document.createElement("div")
  requirementsContainer.classList.add("requirements-container")

  for (const reqIndex in section.requirements) {
    const req = section.requirements[reqIndex]
    const reqContainer = createRequirement(
      req,
      parseInt(reqIndex),
      sectionIndex,
    )
    requirementsContainer.appendChild(reqContainer)
  }

  sectionContainer.appendChild(requirementsContainer)
  return sectionContainer
}

export const getCustomFeedback = (
  uniqueId: string,
): [string | null, number] => {
  const cf = document.getElementById(`${uniqueId}_custom_feedback`)
  if (!cf) return [null, 0]

  const feedback = cf.querySelector(".cf") as HTMLInputElement
  const marks = cf.querySelector(".cn") as HTMLInputElement

  return [
    feedback ? feedback.value.trim() : null,
    marks ? Number(marks.value) : 0,
  ]
}

const evalStudentSubmission = async (json: CodeJson) => {
  const rawSubmission = document.getElementsByClassName("col-12 col-md-11")
  // @ts-expect-error
  const studentSubmisson = rawSubmission[10].innerText

  fetch("https://json-hub.shahriyar.dev/api/extension/eval", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: studentSubmisson,
      jsonData: json,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      insertFeedbackCode(data as { feedback: string, totalMarks: number })
    })
}

export const showFeedbackBuilder = () => {
  const jsonData = getJsonData()

  if (jsonData.type === "code") {
    evalStudentSubmission(jsonData as CodeJson)
    return
  }

  const sections = jsonData.sections

  const feedbackBox = document.querySelector(".feedback-box")

  const existingBuilder = document.querySelector("#feedbackbuilder")
  if (existingBuilder) return

  const feedbackBuilder = document.createElement("div")
  feedbackBuilder.id = "feedbackbuilder"
  feedbackBuilder.style.margin = "20px"
  feedbackBuilder.style.border = "2px solid gray"
  feedbackBuilder.style.padding = "20px"
  feedbackBuilder.style.borderRadius = "20px"

  for (const sectionIndex in sections) {
    const section = sections[sectionIndex]
    const sectionHtml = createSection(section, parseInt(sectionIndex))
    feedbackBuilder.appendChild(sectionHtml)
  }

  const insertButton = document.createElement("button")
  insertButton.id = "insert-button"
  insertButton.textContent = "Insert"
  insertButton.className = "w-full px-4 btn btn-primary"
  insertButton.addEventListener("click", insertFeedback)

  feedbackBuilder.appendChild(insertButton)

  feedbackBox?.insertBefore(
    feedbackBuilder,
    feedbackBox.querySelector("form") as HTMLElement,
  )
}
