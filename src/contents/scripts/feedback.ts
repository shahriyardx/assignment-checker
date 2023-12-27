import { getCustomFeedback, getInputChecked } from "./html_helper"
import type { BaseRequirement, Requirement } from "./types"
import { getJsonData } from "./utils"

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

const notOKay = (msg?: string | null, mark = 0) => {
  return `<em style='color:${mark > 0 ? "red" : "orange"};'>→ ${
    msg || "not okay"
  }</em>`
}

export const insertFeedback = () => {
  const insertBtn = document.getElementById("insert-button")
  if (!insertBtn) return

  const jsonData = getJsonData()
  const sections = jsonData.sections

  const submittedMarkEL = document.querySelector(".font-weight-bold.pl-2")
  const totalMarkEl = document.querySelector("#TotalMark") as HTMLInputElement
  const submittedMark = totalMarkEl
    ? Number(totalMarkEl.value)
    : submittedMarkEL
      ? Number(submittedMarkEL.textContent)
      : 60

  let highestMark = 0

  if (jsonData.highestMark) {
    highestMark = Number(jsonData.highestMark)
  } else {
    const badge = document.querySelector(".badge")?.textContent

    if (badge) {
      highestMark = parseInt(
        document.querySelector(".badge")?.textContent as string,
      )
    } else {
      highestMark = submittedMark
    }
  }

  let feedback = ""
  let marks = highestMark
  let globalIndex = 0

  for (const sectionIndex in sections) {
    const section = sections[sectionIndex]

    feedback += `<strong># ${section.name}</strong>\n`

    for (const reqIndex in section.requirements) {
      globalIndex += 1
      const req = section.requirements[reqIndex] as Requirement
      const reqId = `${parseInt(sectionIndex)}_${parseInt(reqIndex)}`
      const reqCorrect = getInputChecked(reqId)

      if (!reqCorrect) {
        const [cf, cn] = getCustomFeedback(reqId)

        feedback += `${globalIndex}. ${req.data.description} ${notOKay(
          cf || req.data.notOkayMessage,
          Number(req.data.number),
        )}\n`

        marks -= Number(req.data.number)
        marks += cn
      } else {
        let reqMsg = `${globalIndex}. ${req.data.description}`
        let subReqMsg = ""
        let allSubOk = true

        const subRequirements = req.subRequirements as BaseRequirement[]
        for (const subReqIndex in subRequirements) {
          const subReq = subRequirements[subReqIndex]
          const subReqId = `${parseInt(sectionIndex)}_${parseInt(
            reqIndex,
          )}_${parseInt(subReqIndex)}`

          const subReqCorrect = getInputChecked(subReqId)

          if (!subReqCorrect) {
            const [cf, cn] = getCustomFeedback(subReqId)

            allSubOk = false
            if (Number(subReq.number)) {
              marks -= Number(subReq.number)
              marks += cn
            }

            subReqMsg += ` └─ ${subReq.description} ${notOKay(
              cf || subReq.notOkayMessage,
              Number(subReq.number),
            )}\n`
          }
        }

        if (!allSubOk) {
          reqMsg += `\n ${subReqMsg}`
        } else {
          reqMsg += ` → ${req.data.okayMessage}\n`
        }

        feedback += reqMsg
      }
    }
    feedback += "\n"
  }

  feedback += feedbackFooter

  let obtainedMark = marks

  if (highestMark !== submittedMark) {
    const numPercent = (marks / highestMark) * 100
    const obtainedMarkCeiled = Math.ceil(
      Number((submittedMark / 100) * numPercent),
    )
    obtainedMark = Math.min(obtainedMarkCeiled, submittedMark)
  }

  const textArea = document.querySelector(".ql-editor p")
  if (textArea) {
    textArea.innerHTML = feedback
  }

  const markBox = document.querySelector("#Mark") as HTMLInputElement
  const suggestion = document.querySelector("#markSuggestions")

  markBox.focus()
  markBox.value = String(obtainedMark)
  markBox.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.code === "Enter") {
      const submitButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent === "Submit",
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
