import type { Json, Requirement, Section, SubRequirement } from "./types"

const legacyToNew = (json: { [key: string]: any }) => {
  const data: Json = {
    type: "new",
    data: { sections: [] },
  }

  for (const sectionName in json) {
    const requirements: { [key: string]: any }[] = Object.values(
      json[sectionName],
    )
    const transformedRequirements: Requirement[] = requirements.map(
      (requirement) => {
        const subreqs: SubRequirement[] = []

        for (const key in requirement) {
          console.log(key)
          if (key.startsWith("sub_req_")) {
            const subReq = requirement[key]

            const transformed = {
              description: subReq.description,
              number: subReq.number as string,
              correct: subReq.correct,
              message: subReq.message,
              okayMessage: subReq.okayMessage || "okay",
              notOkayMessage: subReq.notOkayMessage || subReq.message,
            }

            subreqs.push(transformed)
          }
        }

        const reqData = {
          data: {
            description: requirement.description,
            number: requirement.number as string,
            correct: requirement.correct,
            message: requirement.message,
            okayMessage: requirement.okayMessage || "okay",
            notOkayMessage: requirement.notOkayMessage || requirement.message,
          },
          subRequirements: subreqs,
        }

        return reqData
      },
    )

    data.data.sections.push({
      name: sectionName,
      requirements: transformedRequirements,
    })
  }

  console.log(data)
  return data
}

export const getJsonData = () => {
  const data = localStorage.getItem("assignment-data") as string
  const assignmentJson = JSON.parse(data).data

  if (assignmentJson.type == "new") {
    return assignmentJson.sections as Section[]
  }

  return legacyToNew(assignmentJson).data.sections
}

export const openFirstAssignment = () => {
  if (document.querySelector(".assignment-evaluation-form")) return
  const assignment = document.querySelector(
    ".btn.btn-icon.btn-eye-icon",
  ) as HTMLButtonElement

  if (assignment) {
    assignment.click()
  }
}

export const submitMarks = () => {
  const submitButton = Array.from(document.querySelectorAll("button")).find(
    (btn) => btn.textContent == "Submit" || btn.textContent == "Update Mark",
  )

  if (submitButton) {
    submitButton.click()
  }
}
