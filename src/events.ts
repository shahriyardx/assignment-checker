import { enableJsonLoader, showJsonLoader } from "./loader"
import { showFeedbackBuilder } from "./feedback"

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key == "|") {
    showJsonLoader()
    enableJsonLoader()
  }

  if (event.key == "]") {
    showFeedbackBuilder()
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
