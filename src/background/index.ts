import {
  RELEASE_URL,
  getCurrentVersion,
  getLatestVersionInfo,
  shouldCheckForUpdate,
} from "@/utils"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      action: "urlChange",
      url: changeInfo.url,
    })
  }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "createTab") {
    chrome.tabs.create({ url: message.url })
    sendResponse({ received: true })
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
          url: `${RELEASE_URL}/${latestVersion}`,
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
