import { showGithubStats } from "./github"
import { showJsonLoader } from "./loader"
import { insertFeedback } from "./feedback"
import { showFeedbackBuilder } from "./html_helper"
import { getJsonData, openFirstAssignment } from "./utils"

export const allowedPaths = [
  "/instructor-dashboard/assignments",
  "/instructor-dashboard/my-assignment",
  "/instructor-dashboard/mock-interview-my-student",
  "/instructor-dashboard/mock-interview-completed"
]

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.code == "Backslash") {
    showJsonLoader()
  }

  if (event.shiftKey && event.code == "KeyP") {
    const data = getJsonData()
    console.log(data)
  }

  if (!event.shiftKey && event.code == "BracketRight") {
    showFeedbackBuilder()
  }

  if (allowedPaths.includes(window.location.pathname)) {
    if (event.shiftKey && event.code == "KeyO") {
      openFirstAssignment()
    }

    if (event.shiftKey && event.code == "BracketRight") {
      if (document.getElementById("insert-button")) {
        insertFeedback()
      }
    }

    if (event.shiftKey && event.code == "BracketLeft") {
      showGithubStats()
    }
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
