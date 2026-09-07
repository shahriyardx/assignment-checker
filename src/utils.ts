export const getCurrentVersion = () => {
  return `v${chrome.runtime.getManifest().version}`
}

/** Tags may or may not carry a leading "v", so compare on the number alone. */
export const normalizeVersion = (version: string | null) =>
  version?.trim().replace(/^v/i, "") ?? null

export const isUpToDate = (current: string | null, latest: string | null) => {
  const a = normalizeVersion(current)
  const b = normalizeVersion(latest)

  // an unknown latest version is not a reason to nag
  if (!a || !b) return true

  return a === b
}

export const RELEASE_URL =
  "https://github.com/shahriyardx/assignment-checker/releases/latest"

const LATEST_RELEASE_API =
  "https://api.github.com/repos/shahriyardx/assignment-checker/releases/latest"

export type LatestVersionInfo = {
  latestVersion: string | null
  changelog: string | null
  error: string | null
}

export const getLatestVersionInfo = async (): Promise<LatestVersionInfo> => {
  try {
    const response = await fetch(LATEST_RELEASE_API)

    if (!response.ok) {
      return {
        latestVersion: null,
        changelog: null,
        error: `GitHub returned ${response.status}`,
      }
    }

    const data = await response.json()

    return {
      latestVersion: data.tag_name ?? null,
      changelog: data.body ?? null,
      error: null,
    }
  } catch {
    return {
      latestVersion: null,
      changelog: null,
      error: "Could not reach GitHub. Check your connection.",
    }
  }
}

/* ---------------- keyboard shortcuts ---------------- */

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"])

export const isModifierKey = (key: string) => MODIFIER_KEYS.has(key)

const PRETTY_KEYS: Record<string, string> = {
  " ": "Space",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Escape: "Esc",
}

const prettyKey = (key: string) => PRETTY_KEYS[key] ?? key

export type Keymap = {
  shiftKey: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  key: string
  text: string
}

export const getKeymap = (event: KeyboardEvent): Keymap => {
  // a modifier on its own is not a shortcut, so it never contributes a key part
  const keyPart = isModifierKey(event.key) ? null : prettyKey(event.key)

  const parts = [
    event.ctrlKey ? "Ctrl" : null,
    event.altKey ? "Alt" : null,
    event.shiftKey ? "Shift" : null,
    event.metaKey ? "Meta" : null,
    keyPart,
  ]

  return {
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    key: event.key,
    text: parts.filter((part) => !!part).join(" + "),
  }
}

export type ShortcutName =
  | "openAssignmentShortcut"
  | "showFeedbackBuilder"
  | "insertFeedbackShortcut"
  | "submitMarksShortcut"

export const DEFAULT_SHORTCUTS: Record<ShortcutName, string> = {
  openAssignmentShortcut: "Shift + O",
  showFeedbackBuilder: "]",
  insertFeedbackShortcut: "Shift + }",
  submitMarksShortcut: "Shift + Enter",
}

export const SHORTCUT_LABELS: Record<ShortcutName, string> = {
  openAssignmentShortcut: "Open assignment",
  showFeedbackBuilder: "Show feedback builder",
  insertFeedbackShortcut: "Insert feedback",
  submitMarksShortcut: "Submit marks",
}
