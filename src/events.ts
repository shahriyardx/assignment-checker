import { showGithubStats } from "./github"
import { showJsonLoader } from "./loader"
import { insertFeedback, showFeedbackBuilder } from "./feedback"

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.code == "Backslash") {
    showJsonLoader()
  }

  if (!event.shiftKey && event.code == "BracketRight") {
    showFeedbackBuilder()
  }

  if (event.shiftKey && event.key == "BracketLeft") {
    showGithubStats()
  }

  if (window.location.pathname == "/instructor-dashboard/my-assignment") {
    if (event.code == "KeyI") {
      if (document.querySelector(".assignment-evaluation-form")) return
      const assignment = document.querySelector(
        ".btn.btn-icon.btn-eye-icon.btn-primary"
      ) as HTMLButtonElement
      if (assignment) {
        assignment.click()
      }
    }

    if (event.shiftKey && event.code == "BracketRight") {
      if (document.getElementById("insert-button")) {
        insertFeedback()
      }
    }
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
