import { enableJsonLoader, showJsonLoader } from "./loader"
import { config } from "./globals"
import { showFeedbackBuilder } from "./feedback"

const handleKeyDown = (event: KeyboardEvent) => {
  console.log("Pressed", event.key)

  if (event.key == "|") {
    config.setLoader = !config.showLoader

    showJsonLoader()
    enableJsonLoader()
  }

  if (event.key == "]") {
    config.showLoader = true
    showFeedbackBuilder()
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
