import { showGithubStats } from "./github"
import { showJsonLoader } from "./loader"
import { insertFeedback, showFeedbackBuilder } from "./feedback"

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key == "|") {
    showJsonLoader()
  }

  if (event.key == "]") {
    showFeedbackBuilder()
  }

  if (event.key == "[") {
    showGithubStats()
  }

  if (window.location.pathname == "/instructor-dashboard/my-assignment") {
    if (event.code == "Backslash") {
      if (document.getElementById("insert-button")) {
        insertFeedback()
      }
    }

    if (event.code == "KeyI") {
      const assignment = document.querySelector(
        ".btn.btn-icon.btn-eye-icon.btn-primary"
      ) as HTMLButtonElement
      if (assignment) {
        assignment.click()
      }
    }
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
