import type { PlasmoCSConfig } from "plasmo"
import { registerKeyboardEvents } from "./scripts/events"

registerKeyboardEvents()

export const config: PlasmoCSConfig = {
  matches: ["https://web.programming-hero.com/instructor-dashboard/*"],
  all_frames: true,
}

export {}
