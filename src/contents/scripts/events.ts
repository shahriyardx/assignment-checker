import { getSettings } from "@/hooks"
import { DEFAULT_SHORTCUTS, getKeymap } from "@/utils"
import { insertFeedback } from "./feedback"
import { showFeedbackBuilder } from "./html_helper"
import { showJsonLoader } from "./loader"
import { openFirstAssignment, openLinks } from "./utils"

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.shiftKey && event.code === "Backslash") {
    showJsonLoader()
  }

  const settings = await getSettings()

  const keymap = getKeymap(event)
  const mapText = keymap.text

  const openShortCut =
    settings.openAssignmentShortcut?.text ||
    DEFAULT_SHORTCUTS.openAssignmentShortcut
  const insertShortCut =
    settings.insertFeedbackShortcut?.text ||
    DEFAULT_SHORTCUTS.insertFeedbackShortcut
  const submitShortcut =
    settings.submitMarksShortcut?.text || DEFAULT_SHORTCUTS.submitMarksShortcut
  const showBuilder =
    settings.showFeedbackBuilder?.text || DEFAULT_SHORTCUTS.showFeedbackBuilder

  if (mapText === openShortCut) {
    openFirstAssignment(() => {
      setTimeout(() => {
        if (settings.openLinks) {
          openLinks()
        }

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
      setTimeout(() => {
        openFirstAssignment(() => {
          setTimeout(() => {
            if (settings.openLinks) {
              openLinks()
            }

            const okButton = Array.from(
              document.querySelectorAll("button"),
            ).find((btn) => btn.textContent === "OK")

            if (okButton) okButton.click()
            showFeedbackBuilder()
          }, 1000)
        })
      }, 2000)
    }
  }
}

export const registerKeyboardEvents = () => {
  document.addEventListener("keydown", handleKeyDown)
}
