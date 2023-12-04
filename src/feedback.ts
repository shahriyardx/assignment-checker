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
  const jsonData = JSON.parse(
    localStorage.getItem("assignment-data") as string
  ) as { [key: string]: object }

  const sections: Section[] = []

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

const notOKay = "-> <em>not okay</em>"
const insertFeedback = () => {
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
      const reqCorrect = getInputChecked(
        `${parseInt(sectionIndex)}_${parseInt(reqIndex)}`
      )

      if (!reqCorrect) {
        feedback += `${globalIndex}. ${req.data.description} ${notOKay}\n`
        marks -= parseFloat(req.data.number)
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
            marks -= parseFloat(subReq.number)
            subReqMsg += `\t-> ${subReq.description} ${notOKay}\n`
          } else {
            subReqMsg += `\t-> ${subReq.description} -> okay\n`
          }
        }

        if (!allSubOk) {
          reqMsg += "\n" + subReqMsg
        } else {
          reqMsg += ` -> okay\n`
        }

        feedback += reqMsg
      }
    }
    feedback += "\n"
  }

  console.log(feedback)
}

export const showFeedbackBuilder = () => {
  const data = getJsonData()
  const feedbackBox = document.querySelector(".feedback-box")

  const feedbackBuilder = document.createElement("div")
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
  insertButton.addEventListener("click", insertFeedback)

  feedbackBuilder.appendChild(insertButton)

  feedbackBox?.insertBefore(
    feedbackBuilder,
    feedbackBox.querySelector("form") as HTMLElement
  )
}
