import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export const getCurrentVersion = () => {
  return `v${chrome.runtime.getManifest().version}`
}

export const shouldCheckForUpdate = async (force = false) => {
  const currentDateTime = new Date()

  if (force) {
    storage.set("lastUpdateCheck", currentDateTime.toISOString())
    return true
  }

  const lastUpdateCheck = await storage.get("lastUpdateCheck")

  if (lastUpdateCheck) {
    const lastDate = new Date(lastUpdateCheck).getTime()
    const currentTime = currentDateTime.getTime()

    const delta = 24 * 60 * 60 * 1000
    const diff = currentTime - lastDate

    if (diff < delta) return false
  }

  return true
}

export const getLatestVersionInfo = async () => {
  const data = await (
    await fetch(
      "https://api.github.com/repos/shahriyardx/assignment-checker/releases/latest",
    )
  ).json()

  return { latestVersion: data.tag_name, changelog: data.body }
}

export const getKeymap = (event: KeyboardEvent) => {
  const ctrl = event.ctrlKey ? "Ctrl" : null
  const alt = event.altKey ? "Alt" : null
  const shift = event.shiftKey ? "Shift" : null
  const key = event.key

  const keys = [ctrl, alt, shift, key]

  return {
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    key: event.key,
    text: keys.filter((k) => !!k).join(" + "),
  }
}

export const RELEASE_URL =
  "https://github.com/shahriyardx/assignment-checker/releases/latest"
