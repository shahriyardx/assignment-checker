import { insertFeedback } from "./feedback"
import { showNotice } from "./notice"
import { injectPanelStyles } from "./panel-styles"
import type { Requirement, Section, SubRequirement } from "./types"
import { getJsonData } from "./utils"

const getCustomFeedbackEl = (uniqueId: string) => {
  const customFeedback = document.createElement("div")
  customFeedback.id = `${uniqueId}_custom_feedback`
  customFeedback.className = "ac-cf"

  const cfHtml = `
      <input type="text" class="cf ac-input" placeholder="Custom feedback">
      <input type="number" class="cn ac-input" placeholder="Partial">
    `

  customFeedback.innerHTML = cfHtml

  return customFeedback
}

export const getInputChecked = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement
  return input?.checked
}

const setCustomFeedbackVisible = (uniqueId: string, visible: boolean) => {
  const cf = document.getElementById(`${uniqueId}_custom_feedback`)
  if (cf) {
    cf.style.display = visible ? "grid" : "none"
  }
}

const getSubRequirementInputs = (reqId: string) =>
  Array.from(
    document.querySelectorAll<HTMLInputElement>(
      `input[data-reqindex^="${reqId}_"]`,
    ),
  )

const syncSubRequirements = (reqId: string, reqChecked: boolean) => {
  for (const sub of getSubRequirementInputs(reqId)) {
    if (!reqChecked) {
      // the whole requirement is wrong, so its sub-requirements are too. their
      // custom feedback stays hidden because insertFeedback() ignores them.
      sub.checked = false
      setCustomFeedbackVisible(sub.id, false)
    } else if (!sub.checked) {
      // back in play, so any still-unchecked sub needs its input on screen
      setCustomFeedbackVisible(sub.id, true)
    }
  }
}

const showCustomFeedbackEl = (event: Event) => {
  const target = event.target as HTMLInputElement

  setCustomFeedbackVisible(target.id, !target.checked)
  syncSubRequirements(target.id, target.checked)
}

const createCheckInput = (uniqueId: string) => {
  const input = document.createElement("input")
  input.type = "checkbox"
  input.className = "ac-check"
  input.setAttribute("data-reqindex", uniqueId)
  input.setAttribute("id", uniqueId)
  input.setAttribute("checked", "yes")
  input.addEventListener("change", (e) => showCustomFeedbackEl(e))

  return input
}

const createLabel = (
  description: string,
  marks: string,
  htmlFor: string,
  index?: number,
) => {
  const label = document.createElement("label")
  label.className = "ac-req__label"
  label.htmlFor = htmlFor

  if (index !== undefined) {
    const num = document.createElement("span")
    num.className = "ac-num"
    num.textContent = `${index}.`
    label.appendChild(num)
  }

  label.appendChild(document.createTextNode(description))

  const marksChip = document.createElement("span")
  marksChip.className = "ac-marks"
  marksChip.textContent = marks
  label.appendChild(marksChip)

  return label
}

const createReqLine = (label: HTMLElement, check: HTMLElement) => {
  const line = document.createElement("div")
  line.className = "requirement-handler ac-req__line"

  line.appendChild(label)
  line.appendChild(check)

  return line
}

const createSubrequirement = (
  requirements: SubRequirement[],
  reqIndex: number,
  sectionIndex: number,
) => {
  const reqContainer = document.createElement("div")
  reqContainer.className = "sub-requirements-container ac-subs"

  for (const subReqIndex in requirements) {
    const subReq = requirements[subReqIndex]

    const uniqueId = `${sectionIndex}_${reqIndex}_${subReqIndex}`
    const cf = getCustomFeedbackEl(uniqueId)

    const reqTitle = createLabel(subReq.description, subReq.number, uniqueId)
    const line = createReqLine(reqTitle, createCheckInput(uniqueId))

    const single = document.createElement("div")
    single.className = "single-requirement ac-req"
    single.appendChild(line)
    single.appendChild(cf)

    reqContainer.appendChild(single)
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

  const uniqueId = `${sectionIndex}_${reqIndex}`
  const cf = getCustomFeedbackEl(uniqueId)

  const reqTitle = createLabel(
    requirement.data.description,
    requirement.data.number,
    uniqueId,
    reqIndex + 1,
  )

  const line = createReqLine(reqTitle, createCheckInput(uniqueId))

  const single = document.createElement("div")
  single.className = "single-requirement ac-req"
  single.appendChild(line)
  single.appendChild(cf)

  reqContainer.appendChild(single)

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
  sectionContainer.className = "ac-section"
  sectionContainer.id = section.name

  const sectionTitle = document.createElement("div")
  sectionTitle.className = "ac-label"
  sectionTitle.textContent = section.name

  sectionContainer.appendChild(sectionTitle)

  const requirementsContainer = document.createElement("div")
  requirementsContainer.className = "requirements-container ac-reqs"

  for (const reqIndex in section.requirements) {
    const req = section.requirements[reqIndex]
    const reqContainer = createRequirement(
      req,
      Number.parseInt(reqIndex, 10),
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

export const showFeedbackBuilder = () => {
  const jsonData = getJsonData()
  if (!jsonData?.sections?.length) return

  const sections = jsonData.sections

  const feedbackBox = document.querySelector(".feedback-box")
  if (!feedbackBox) {
    showNotice("Open an assignment first, then show the builder.", "error")
    return
  }

  const existingBuilder = document.querySelector("#feedbackbuilder")
  if (existingBuilder) return

  injectPanelStyles()

  const feedbackBuilder = document.createElement("div")
  feedbackBuilder.id = "feedbackbuilder"
  feedbackBuilder.className = "ac-panel ac-panel--builder"

  for (const sectionIndex in sections) {
    const section = sections[sectionIndex]
    const sectionHtml = createSection(
      section,
      Number.parseInt(sectionIndex, 10),
    )
    feedbackBuilder.appendChild(sectionHtml)
  }

  const insertButton = document.createElement("button")
  insertButton.id = "insert-button"
  insertButton.type = "button"
  insertButton.textContent = "Insert feedback"
  insertButton.className = "ac-insert"
  insertButton.addEventListener("click", () => insertFeedback())

  feedbackBuilder.appendChild(insertButton)

  feedbackBox.insertBefore(
    feedbackBuilder,
    feedbackBox.querySelector("form") as HTMLElement,
  )
}
