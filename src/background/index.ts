import { getCurrentVersion, getLatestVersionInfo, shouldCheckForUpdate } from "@/utils"


const checkUpdate = async () => {
  const currentDateTime = new Date()

  if (!(await shouldCheckForUpdate())) return

  await chrome.storage.local.set({
    lastUpdateCheck: currentDateTime.toISOString()
  })

  const currentVersion = getCurrentVersion()
  const { latestVersion, changelog } = await getLatestVersionInfo()

  if (currentVersion !== latestVersion) {
    sendUpdateNotification({ currentVersion, latestVersion, changelog })
  }
}

const sendUpdateNotification = ({
  latestVersion,
  changelog
}: {
  currentVersion: string
  latestVersion: string
  changelog: string
}) => {
  const manifest = chrome.runtime.getManifest()
  const btnId = `update_${latestVersion}`

  chrome.action.setBadgeText({ text: "1" })

  chrome.notifications.create(btnId, {
    iconUrl: "icons/icon32.png",
    title: `[Update] ${manifest.name}`,
    type: "basic",
    message: `A new update is available for ${manifest.name} (${latestVersion})\n\nWhats New:\n${changelog}`,
    requireInteraction: true,
    buttons: [{ title: "Download" }]
  })

  chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
      if (notificationId === notificationId && buttonIndex === 0) {
        chrome.tabs.create({
          url: `https://github.com/shahriyardx/assignment-checker/releases/tag/${latestVersion}`
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

  getLatestVersionInfo().then((response) => {
    console.log(response)
  })
})
