import { JsonData } from "./types"

interface BaseRequirement {
  description: string
  number: string
  correct: boolean
  message: string
}

type SubRequirement = BaseRequirement & {}

type Requirement = {
  data: BaseRequirement
  subRequirements: SubRequirement[]
}

type Section = {
  name: string
  requirements: Requirement[]
}

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
    const reqTitle = document.createElement("label")
    reqTitle.htmlFor = uniqueId

    const reqCheckContainer = document.createElement("div")
    const reqCheckInput = document.createElement("input")
    reqCheckInput.type = "checkbox"
    reqCheckInput.setAttribute("data-reqindex", uniqueId)
    reqCheckInput.setAttribute("id", uniqueId)
    reqCheckInput.setAttribute("checked", "yes")

    reqCheckContainer.appendChild(reqCheckInput)

    reqTitle.textContent = `${parseInt(subReqIndex) + 1}. ${subReq.description}`

    mainRequirement.appendChild(reqTitle)
    mainRequirement.appendChild(reqCheckContainer)

    reqContainer.appendChild(mainRequirement)
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
  const reqTitle = document.createElement("label")
  reqTitle.htmlFor = uniqueId

  const reqCheckContainer = document.createElement("div")
  const reqCheckInput = document.createElement("input")
  reqCheckInput.type = "checkbox"
  reqCheckInput.setAttribute("checked", "yes")
  reqCheckInput.setAttribute("id", uniqueId)
  reqCheckInput.setAttribute("data-reqindex", uniqueId)

  reqCheckContainer.appendChild(reqCheckInput)

  reqTitle.textContent = `${reqIndex + 1}. ${requirement.data.description}`

  mainRequirement.appendChild(reqTitle)
  mainRequirement.appendChild(reqCheckContainer)

  reqContainer.appendChild(mainRequirement)

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

const getJsonData = () => {
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

const getInputChecked = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement
  return input?.checked
}

const notOKay = "<em style='color:red;'>→ not okay</em>"
const insertFeedback = () => {
  const sections = getJsonData().sections
  console.log(sections)
  let feedback = ""
  let marks = 60
  let globalIndex = 0

  for (const sectionIndex in sections) {
    const section = sections[sectionIndex]

    feedback += `<strong># ${section.name}</strong>\n`

    for (const reqIndex in section.requirements) {
      globalIndex += 1
      const req = section.requirements[reqIndex]
      const reqCorrect = getInputChecked(
        `${parseInt(sectionIndex)}_${parseInt(reqIndex)}`
      )

      if (!reqCorrect) {
        feedback += `${globalIndex}. ${req.data.description} ${notOKay}\n`
        marks -= Number(req.data.number)
        console.log(req.data.number, marks)
      } else {
        let reqMsg = `${globalIndex}. ${req.data.description}`
        let subReqMsg = ""
        let allSubOk = true

        for (const subReqIndex in req.subRequirements) {
          const subReq = req.subRequirements[subReqIndex]
          const subReqCorrect = getInputChecked(
            `${parseInt(sectionIndex)}_${parseInt(reqIndex)}_${parseInt(
              subReqIndex
            )}`
          )

          if (!subReqCorrect) {
            allSubOk = false
            marks -= Number(subReq.number)
            console.log(subReq.number, marks)
            subReqMsg += `&emsp;&emsp;&emsp;&emsp;• ${subReq.description} ${notOKay}\n`
          } else {
            subReqMsg += `&emsp;&emsp;&emsp;&emsp;• ${subReq.description} → okay\n`
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

  if (submittedMark > 0 && submittedMark <= 30) {
    submittedMark = 30
  } else if (submittedMark > 30 && submittedMark <= 50) {
    submittedMark = 50
  } else {
    submittedMark = 60
  }

  const numPercent = (marks / 60) * 100
  const obtainedMarkCeiled = Math.ceil(
    Number((submittedMark / 100) * numPercent)
  )
  const obtainedMark = Math.min(obtainedMarkCeiled, submittedMark)

  const textArea = document.querySelector(".ql-editor p")
  if (textArea) {
    textArea.innerHTML = feedback
  }

  const markBox = document.querySelector("#Mark")
  const suggestion = document.querySelector("#markSuggestions")

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
  insertButton.textContent = "Insert"
  insertButton.className = "btn px-4 btn-primary w-full"
  insertButton.addEventListener("click", insertFeedback)

  feedbackBuilder.appendChild(insertButton)

  feedbackBox?.insertBefore(
    feedbackBuilder,
    feedbackBox.querySelector("form") as HTMLElement
  )
}
