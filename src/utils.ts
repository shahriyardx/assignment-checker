export const getCurrentVersion = () => {
  return `v${chrome.runtime.getManifest().version}`
}

export const shouldCheckForUpdate = async (force: boolean = false) => {
  const currentDateTime = new Date()

  if (force) {
    await chrome.storage.local.set({
      lastUpdateCheck: currentDateTime.toISOString()
    })

    return true
  }

  const storageData = await chrome.storage.local.get("lastUpdateCheck")
  if (storageData.lastUpdateCheck) {
    const lastDate = new Date(storageData.lastUpdateCheck).getTime()
    const currentTime = currentDateTime.getTime()

    const delta = 24 * 60 * 60 * 1000
    const diff = currentTime - lastDate

    if (diff < delta) return false
  }

  return true
}

export const getLatestVersionInfo = async (force: boolean = false) => {
  if (!(await shouldCheckForUpdate(force)))
    return await chrome.storage.local.get(["latestVersion", "changelog"])

  const data = await (
    await fetch(
      ` https://api.github.com/repos/shahriyardx/assignment-checker/releases/latest`
    )
  ).json()

  const versionInfo = { latestVersion: data.tag_name, changelog: data.body }
  chrome.storage.local.set(versionInfo)

  return versionInfo
}
