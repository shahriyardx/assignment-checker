import { showNotice } from "./notice"
import type {
  AssignmentData,
  JSONDATA,
  Json,
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

/**
 * Reads the active JSON out of localStorage. Returns null (and tells the user)
 * when nothing is loaded or the stored value is not usable, so callers never
 * blow up on a missing or corrupt entry.
 */
export const getJsonData = (): JSONDATA | null => {
  const data = localStorage.getItem("assignment-data")

  if (!data) {
    showNotice("No JSON loaded. Press Shift + \\ to open the loader.", "error")
    return null
  }

  let assignmentJson: AssignmentData

  try {
    assignmentJson = JSON.parse(data) as AssignmentData
  } catch {
    showNotice("The active JSON is corrupt. Load it again.", "error")
    return null
  }

  const assignmentData = assignmentJson?.data

  if (!assignmentData) {
    showNotice("The active JSON has no data.", "error")
    return null
  }

  if (assignmentData.type === "new") {
    return assignmentData as JSONDATA
  }

  return legacyToNew(assignmentData as OldJson) as JSONDATA
}

export const openFirstAssignment = (callback?: CallableFunction) => {
  if (document.querySelector(".assignment-evaluation-form")) return

  const assignment = document.querySelector(
    ".btn.btn-icon.btn-eye-icon",
  ) as HTMLButtonElement | null

  if (!assignment) {
    showNotice("No assignment found to open on this page.", "error")
    return
  }

  assignment.click()
  callback?.()
}

export const getSubmissionText = () => {
  const rawSubmission = document.getElementsByClassName("col-12 col-md-11")
  const last = rawSubmission[rawSubmission.length - 1] as
    | HTMLElement
    | undefined

  return last?.innerText ?? ""
}

export const getSubmittionLinks = (text: string) => {
  const linkRegex =
    /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]\.)+[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9](?:\/[-a-zA-Z0-9()@:%_+.~#?&/=]*)?/gi

  const matches = text.match(linkRegex)
  if (!matches) return []

  return matches.map((link) =>
    link.startsWith("http") ? link : `https://${link}`,
  )
}

export const openLinks = () => {
  const links = getSubmittionLinks(getSubmissionText())

  if (links.length === 0) {
    showNotice("No links found in this submission.")
    return
  }

  for (const link of links) {
    window.open(link, "_blank", "noopener,noreferrer")
  }
}

export const submitMarks = () => {
  const submitButton = Array.from(document.querySelectorAll("button")).find(
    (btn) =>
      btn.textContent === "Submit" ||
      btn.textContent === "Update Mark" ||
      btn.textContent === "Update",
  )

  if (!submitButton) {
    showNotice("No submit button found on this page.", "error")
    return
  }

  submitButton.click()
}
