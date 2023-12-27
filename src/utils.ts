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

export const getLatestVersionInfo = async (force = false) => {
  if (!(await shouldCheckForUpdate(force))) {
    const latestVersion = await storage.get("latestVersion")
    const changelog = await storage.get("changelog")

    if (latestVersion && changelog) return { latestVersion, changelog }
  }

  const data = await (
    await fetch(
      "https://api.github.com/repos/shahriyardx/assignment-checker/releases/latest",
    )
  ).json()

  storage.set("latestVersion", data.tag_name)
  storage.set("changelog", data.body)

  return { latestVersion: data.tag_name, changelog: data.body }
}

export const RELEASE_URL =
  "https://github.com/shahriyardx/assignment-checker/releases/latest"
