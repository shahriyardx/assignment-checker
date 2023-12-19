import {
  getCurrentVersion,
  getLatestVersionInfo,
  shouldCheckForUpdate,
} from "@/utils"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "urlChange",
      url: changeInfo.url,
    })
  }
})

const checkUpdate = async () => {
  const currentDateTime = new Date()

  if (!(await shouldCheckForUpdate())) return

  await storage.set("lastUpdateCheck", currentDateTime.toISOString())

  const { latestVersion, changelog } = await getLatestVersionInfo()
  const currentVersion = getCurrentVersion()

  if (currentVersion !== latestVersion) {
    sendUpdateNotification({ currentVersion, latestVersion, changelog })
  }
}

const sendUpdateNotification = ({
  latestVersion,
  changelog,
}: {
  currentVersion: string
  latestVersion: string
  changelog: string
}) => {
  const manifest = chrome.runtime.getManifest()
  const btnId = `update_${latestVersion}`

  chrome.action.setBadgeText({ text: "1" })

  chrome.notifications.create(btnId, {
    iconUrl: "~assets/icon.png",
    title: `[Update] ${manifest.name}`,
    type: "basic",
    message: `A new update is available for ${manifest.name} (${latestVersion})\n\nWhats New:\n${changelog}`,
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
    },
  )
}

chrome.runtime.onStartup.addListener(() => {
  checkUpdate()
})

chrome.runtime.onInstalled.addListener(() => {
  checkUpdate()
})
