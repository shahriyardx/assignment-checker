import { getSettings, type LocalSettings } from "@/hooks"
import { insertFeedback } from "./feedback"
import { showGithubStats } from "./github"
import { showFeedbackBuilder } from "./html_helper"
import { showJsonLoader } from "./loader"
import { getJsonData, openFirstAssignment, submitMarks } from "./utils"

export const allowedPaths = [
  "/instructor-dashboard/assignments",
  "/instructor-dashboard/my-assignment",
  "/instructor-dashboard/mock-interview-my-student",
  "/instructor-dashboard/mock-interview-completed",
]

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.shiftKey && event.code === "Backslash") {
    showJsonLoader()
  }

  const settings = await getSettings()

  const mapText = `${
    event.shiftKey ? "Shift + " : event.altKey ? "Alt + " : ""
  } ${event.key}`

  const openShortCut = settings.openAssignmentShortcut?.text || "Shift + O"
  const insertShortCut = settings.insertFeedbackShortcut?.text || "Shift + }"
  const submitShortcut = settings.submitMarksShortcut?.text || "Shift + Enter"
  const showBuilder = settings.showFeedbackBuilder?.text || "]"

  if (mapText === openShortCut) {
    openFirstAssignment(() => {
      setTimeout(() => {
        showFeedbackBuilder()
      }, 1000)
    })
  }

  if (mapText === showBuilder) {
    showFeedbackBuilder()
  }

  if (mapText === insertShortCut) {
    if (document.getElementById("insert-button")) {
      insertFeedback()
    }
  }

  if (mapText === submitShortcut) {
    const submitButton = Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Submit",
    )

    if (submitButton) {
      submitButton.click()
    }
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
