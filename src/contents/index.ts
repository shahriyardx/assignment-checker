import type { PlasmoCSConfig } from "plasmo"
import { registerKeyboardEvents } from "./scripts/events"

registerKeyboardEvents()

export const config: PlasmoCSConfig = {
  matches: [
    "https://web.programming-hero.com/instructor-dashboard",
    "https://web.programming-hero.com/instructor-dashboard/*",
  ],
  run_at: "document_idle",
}

export {}
