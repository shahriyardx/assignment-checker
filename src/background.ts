/// <reference types="chrome"/>

const getCurrentVersion = () => {
  return `v${chrome.runtime.getManifest().version}`
}

const checkUpdate = async () => {
  const data = await (
    await fetch(
      ` https://api.github.com/repos/shahriyardx/assignment-checker/releases/latest`
    )
  ).json()

  const currentVersion = getCurrentVersion()
  const latestVersion = data.tag_name
  const versionInfo = data.body

  if (currentVersion !== latestVersion) {
    sendUpdateNotification({ currentVersion, latestVersion, versionInfo })
  }
}

const sendUpdateNotification = ({
  latestVersion,
  versionInfo,
}: {
  currentVersion: string
  latestVersion: string
  versionInfo: string
}) => {
  const manifest = chrome.runtime.getManifest()
  const btnId = `update_${latestVersion}`

  chrome.notifications.create(btnId, {
    iconUrl: "icons/icon32.png",
    title: `[Update] ${manifest.name}`,
    type: "basic",
    message: `A new update is available for ${manifest.name} (${latestVersion})\n\nWhats New:\n${versionInfo}`,
    requireInteraction: true,
    buttons: [{ title: "Download" }],
  })

  chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
      if (notificationId === notificationId && buttonIndex === 0) {
        chrome.tabs.create({
          url: `https://github.com/shahriyardx/assignment-checker/releases/tag/${latestVersion}`,
        })
      }
    }
  )
}

chrome.runtime.onStartup.addListener(() => {
  checkUpdate()
})

chrome.runtime.onInstalled.addListener(() => {
  checkUpdate()
})
