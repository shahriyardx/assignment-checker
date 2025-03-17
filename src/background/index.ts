// chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
//   if (message.action === "createTab") {
//     chrome.tabs.create({ url: message.url })
//     sendResponse({ received: true })
//   }
// })

// const sendUpdateNotification = ({
//   latestVersion,
//   changelog,
// }: {
//   currentVersion: string
//   latestVersion: string
//   changelog: string
// }) => {
//   const manifest = chrome.runtime.getManifest()
//   const btnId = `update_${latestVersion}`

//   chrome.action.setBadgeText({ text: "1" })

//   chrome.notifications.create(btnId, {
//     iconUrl: "~assets/icon.png",
//     title: `[Update] ${manifest.name}`,
//     type: "basic",
//     message: `A new update is available for ${manifest.name} (${latestVersion})\n\nWhats New:\n${changelog}`,
//     requireInteraction: true,
//     buttons: [{ title: "Download" }],
//   })

//   chrome.notifications.onButtonClicked.addListener(
//     (notificationId, buttonIndex) => {
//       if (notificationId === btnId && buttonIndex === 0) {
//         chrome.tabs.create({
//           url: RELEASE_URL,
//         })
//       }
//     },
//   )
// }

// chrome.runtime.onStartup.addListener(() => {
//   checkUpdate()
// })

// chrome.runtime.onInstalled.addListener(() => {
//   checkUpdate()
// })
