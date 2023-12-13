import { JsonData, Requirement, Section, SubRequirement } from "./types"

const feedbackFooter = `
  <strong>Important Instructions:</strong> 
  → Do not post on Facebook, if you have any marks-related issues.
  → Make sure to read all the requirements carefully, If you have any marks-related confusion.
  → If you are confident and If there is a mistake from the examiner's end, give a recheck request.
  → If your recheck reason was not valid, 2 marks will be deducted from your current marks.
  → Please check the documentation below for more information about how to recheck.
  
  <b style="color: red;">We have a recheck option, so please refrain from posting to the group.</b>
  <i style="color: green;">If your recheck reason is valid you will get marks, if not valid 2 marks will be deducted.</i>

  How to Recheck: <a href="https://1drv.ms/b/s!AsHwkj6t2abplhxnqigzCy2IwmLu?e=4JeV37">https://1drv.ms/b/s!AsHwkj6t2abplhxnqigzCy2IwmLu?e=4JeV37</a>
  
  <b>Let's Code_ Your Career</b>
`
const getCustomFeedback = (uniqueId: string): [string | null, number] => {
  const cf = document.getElementById(`${uniqueId}_custom_feedback`)
  if (!cf) return [null, 0]

  const feedback = cf.querySelector(".cf") as HTMLInputElement
  const marks = cf.querySelector(".cn") as HTMLInputElement

  return [
    feedback ? feedback.value.trim() : null,
    marks ? Number(marks.value) : 0,
  ]
}

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

const showCustomFeedbackEl = (event: Event) => {
  const target = event.target as HTMLInputElement
  const display = target.checked ? "none" : "grid"

  const cf = document.getElementById(`${target.id}_custom_feedback`)
  if (cf) {
    cf.style.display = display
  }
}

const createSubrequirement = (
  requirements: SubRequirement[],
  reqIndex: number,
  sectionIndex: number
) => {
  const reqContainer = document.createElement("div")
  reqContainer.classList.add("sub-requirement-container")
  reqContainer.style.marginLeft = "20px"

  for (const subReqIndex in requirements) {
    const subReq = requirements[subReqIndex]

    const mainRequirement = document.createElement("div")
    mainRequirement.classList.add("main-requirement")
    mainRequirement.style.display = "grid"
    mainRequirement.style.gridTemplateColumns = "auto 20px"

    const uniqueId = `${sectionIndex}_${reqIndex}_${subReqIndex}`
    const cf = getCustomFeedbackEl(uniqueId)

    const reqTitle = document.createElement("label")
    reqTitle.htmlFor = uniqueId

    const reqCheckContainer = document.createElement("div")
    const reqCheckInput = document.createElement("input")
    reqCheckInput.type = "checkbox"
    reqCheckInput.setAttribute("data-reqindex", uniqueId)
    reqCheckInput.setAttribute("id", uniqueId)
    reqCheckInput.setAttribute("checked", "yes")
    reqCheckInput.addEventListener("change", (e) => showCustomFeedbackEl(e))

    reqCheckContainer.appendChild(reqCheckInput)

    reqTitle.textContent = `${parseInt(subReqIndex) + 1}. ${
      subReq.description
    } (${subReq.number})`

    mainRequirement.appendChild(reqTitle)
    mainRequirement.appendChild(reqCheckContainer)

    reqContainer.appendChild(mainRequirement)
    reqContainer.appendChild(cf)
  }

  return reqContainer
}

const createRequirement = (
  requirement: Requirement,
  reqIndex: number,
  sectionIndex: number
) => {
  const reqContainer = document.createElement("div")
  reqContainer.classList.add("single-requirement-container")

  const mainRequirement = document.createElement("div")
  mainRequirement.classList.add("main-requirement")
  mainRequirement.style.display = "grid"
  mainRequirement.style.gridTemplateColumns = "auto 20px"

  const uniqueId = `${sectionIndex}_${reqIndex}`
  const cf = getCustomFeedbackEl(uniqueId)

  const reqTitle = document.createElement("label")
  reqTitle.htmlFor = uniqueId

  const reqCheckContainer = document.createElement("div")
  const reqCheckInput = document.createElement("input")
  reqCheckInput.type = "checkbox"
  reqCheckInput.setAttribute("checked", "yes")
  reqCheckInput.setAttribute("id", uniqueId)
  reqCheckInput.setAttribute("data-reqindex", uniqueId)
  reqCheckInput.addEventListener("change", (e) => showCustomFeedbackEl(e))

  reqCheckContainer.appendChild(reqCheckInput)

  reqTitle.textContent = `${reqIndex + 1}. ${requirement.data.description} (${
    requirement.data.number
  })`

  mainRequirement.appendChild(reqTitle)
  mainRequirement.appendChild(reqCheckContainer)

  reqContainer.appendChild(mainRequirement)
  reqContainer.appendChild(cf)

  const subRequirements = createSubrequirement(
    requirement.subRequirements,
    reqIndex,
    sectionIndex
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
      sectionIndex
    )
    requirementsContainer.appendChild(reqContainer)
  }

  sectionContainer.appendChild(requirementsContainer)
  return sectionContainer
}

const getJsonDataLegacy = () => {
  const jsonDataLocal = JSON.parse(
    localStorage.getItem("assignment-data") as string
  ) as JsonData & { data: { [key: string]: object } }
  const jsonData = jsonDataLocal.data

  const sections = []

  for (const sectionName in jsonData) {
    const requirements: Requirement[] = Object.values(
      jsonData[sectionName]
    ).map((requirement) => {
      const subreqs: SubRequirement[] = []
      for (const key in requirement) {
        if (key.startsWith("sub_req_")) {
          subreqs.push(requirement[key])
        }
      }
      const reqData = {
        data: {
          description: requirement.description,
          number: requirement.number,
          correct: requirement.correct,
          message: requirement.message,
        },
        subRequirements: subreqs,
      }

      return reqData
    })

    sections.push({
      name: sectionName,
      requirements,
    })
  }

  return { sections: sections }
}

const getJsonData = () => {
  const jsonDataLocal = JSON.parse(
    localStorage.getItem("assignment-data") as string
  )

  const jsonData = jsonDataLocal.data
  if (jsonData.type == "new") {
    return jsonData as { sections: Section[] }
  }

  return getJsonDataLegacy()
}

const getInputChecked = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement
  return input?.checked
}

const notOKay = (msg?: string | null) => {
  return `<em style='color:red;'>→ ${msg || "not okay"}</em>`
}

export const insertFeedback = () => {
  const sections = getJsonData().sections

  let feedback = ""
  let marks = 60
  let globalIndex = 0

  for (const sectionIndex in sections) {
    const section = sections[sectionIndex]

    feedback += `<strong># ${section.name}</strong>\n`

    for (const reqIndex in section.requirements) {
      globalIndex += 1
      const req = section.requirements[reqIndex]
      const reqId = `${parseInt(sectionIndex)}_${parseInt(reqIndex)}`
      const reqCorrect = getInputChecked(reqId)

      if (!reqCorrect) {
        const [cf, cn] = getCustomFeedback(reqId)
        if (cf) {
          feedback += `${globalIndex}. ${req.data.description} ${notOKay(cf)}\n`
        } else {
          feedback += `${globalIndex}. ${req.data.description} ${notOKay()}\n`
        }
        marks -= Number(req.data.number)
        marks += cn
      } else {
        let reqMsg = `${globalIndex}. ${req.data.description}`
        let subReqMsg = ""
        let allSubOk = true

        for (const subReqIndex in req.subRequirements) {
          const subReq = req.subRequirements[subReqIndex]
          const subReqId = `${parseInt(sectionIndex)}_${parseInt(
            reqIndex
          )}_${parseInt(subReqIndex)}`

          const subReqCorrect = getInputChecked(subReqId)

          if (!subReqCorrect) {
            const [cf, cn] = getCustomFeedback(subReqId)

            allSubOk = false
            if (Number(subReq.number)) {
              marks -= Number(subReq.number)
              marks += cn
            }

            subReqMsg += ` └─ ${subReq.description} ${notOKay(cf)}\n`
          }
        }

        if (!allSubOk) {
          reqMsg += "\n" + subReqMsg
        } else {
          reqMsg += ` → okay\n`
        }

        feedback += reqMsg
      }
    }
    feedback += "\n"
  }

  feedback += feedbackFooter

  const submittedMarkEL = document.querySelector(".font-weight-bold.pl-2")
  const totalMarkEl = document.querySelector("#TotalMark") as HTMLInputElement
  let submittedMark = totalMarkEl
    ? Number(totalMarkEl.value)
    : submittedMarkEL
    ? Number(submittedMarkEL.textContent)
    : 60

  const numPercent = (marks / 60) * 100
  const obtainedMarkCeiled = Math.ceil(
    Number((submittedMark / 100) * numPercent)
  )
  const obtainedMark = Math.min(obtainedMarkCeiled, submittedMark)

  const textArea = document.querySelector(".ql-editor p")
  if (textArea) {
    textArea.innerHTML = feedback
  }

  const markBox = document.querySelector("#Mark") as HTMLInputElement
  const suggestion = document.querySelector("#markSuggestions")

  markBox.focus()
  markBox.value = String(obtainedMark)
  markBox.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.code == "Enter") {
      const submitButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent == "Submit"
      )

      if (submitButton) {
        submitButton.click()
      }
    }
  })

  if (suggestion) {
    suggestion.textContent = `${obtainedMark} ?`
  } else {
    const markSuggestion = document.createElement("p")
    markSuggestion.className = "m-2 w-50"
    markSuggestion.id = "markSuggestions"
    markSuggestion.textContent = `${obtainedMark} ?`
    markBox?.after(markSuggestion)
  }
}

export const showFeedbackBuilder = () => {
  const data = getJsonData()
  const feedbackBox = document.querySelector(".feedback-box")

  const existingBuilder = document.querySelector("#feedbackbuilder")
  if (existingBuilder) return

  const feedbackBuilder = document.createElement("div")
  feedbackBuilder.id = "feedbackbuilder"
  feedbackBuilder.style.margin = "20px"
  feedbackBuilder.style.border = "2px solid gray"
  feedbackBuilder.style.padding = "20px"
  feedbackBuilder.style.borderRadius = "20px"

  for (const sectionIndex in data.sections) {
    const section = data.sections[sectionIndex]
    const sectionHtml = createSection(section, parseInt(sectionIndex))
    feedbackBuilder.appendChild(sectionHtml)
  }

  const insertButton = document.createElement("button")
  insertButton.id = "insert-button"
  insertButton.textContent = "Insert"
  insertButton.className = "btn px-4 btn-primary w-full"
  insertButton.addEventListener("click", insertFeedback)

  feedbackBuilder.appendChild(insertButton)

  feedbackBox?.insertBefore(
    feedbackBuilder,
    feedbackBox.querySelector("form") as HTMLElement
  )
}
