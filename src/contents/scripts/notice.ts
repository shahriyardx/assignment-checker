import { injectPanelStyles } from "./panel-styles"

const NOTICE_TIMEOUT = 4500

/**
 * Small toast used wherever the extension would otherwise fail silently.
 * The page is not ours, so it is always removed again.
 */
export const showNotice = (
  message: string,
  tone: "info" | "error" = "info",
) => {
  injectPanelStyles()

  const existing = document.querySelector(".ac-toast")
  if (existing) existing.remove()

  const toast = document.createElement("div")
  toast.className = `ac-panel ac-toast ac-toast--${tone}`
  toast.setAttribute("role", tone === "error" ? "alert" : "status")
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => toast.remove(), NOTICE_TIMEOUT)
}
