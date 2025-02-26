import type {
  AssignmentData,
  CodeJson,
  Json,
  JSONDATA,
  OldJson,
  Requirement,
  SubRequirement,
} from "./types"

const legacyToNew = (json: { [key: string]: any }) => {
  const data: Json = {
    type: "new",
    sections: [],
    highestMark: null,
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

    data.sections.push({
      name: sectionName,
      requirements: transformedRequirements,
    })
  }

  return data
}

export const getJsonData = () => {
  const data = localStorage.getItem("assignment-data") as string
  const assignmentJson = JSON.parse(data) as AssignmentData

  const assignmentData = assignmentJson.data

  if (assignmentData.type === "new") {
    return assignmentData as JSONDATA
  }

  if (assignmentData.type === "code") {
    return assignmentData as JSONDATA
  }

  return legacyToNew(assignmentData as OldJson) as JSONDATA
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
    (btn) =>
      btn.textContent === "Submit" ||
      btn.textContent === "Update Mark" ||
      btn.textContent === "Update",
  )

  if (submitButton) {
    submitButton.click()
  }
}

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://json-hub.shahriyar.dev"
