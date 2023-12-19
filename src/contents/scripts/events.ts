import { showGithubStats } from "./github"
import { showJsonLoader } from "./loader"
import { insertFeedback } from "./feedback"
import { showFeedbackBuilder } from "./html_helper"
import { openFirstAssignment } from "./utils"

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.code == "Backslash") {
    showJsonLoader()
  }

  if (!event.shiftKey && event.code == "BracketRight") {
    showFeedbackBuilder()
  }

  if (window.location.pathname == "/instructor-dashboard/my-assignment") {
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
