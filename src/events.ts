import { enableJsonLoader, showJsonLoader } from "./loader"
import { showFeedbackBuilder } from "./feedback"
import { showGithubStats } from "./github"

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key == "|") {
    showJsonLoader()
    enableJsonLoader()
  }

  if (event.key == "]") {
    showFeedbackBuilder()
  }

  if (event.key == "[") {
    showGithubStats()
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
