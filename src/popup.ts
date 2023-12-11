/// <reference types="chrome"/>

chrome.action.setBadgeText({ text: "" })

const main = async () => {
  const storage = await chrome.storage.local.get("latestVersion")
  const currentVersion = `v${chrome.runtime.getManifest().version}`
  const latestVersion = storage.latestVersion

  if (!latestVersion) return

  if (currentVersion !== latestVersion) {
    const container = document.getElementById("updateContainer")
    if (container) {
      container.innerText = `Update available: ${latestVersion}`
      container.style.display = "block"
      container.addEventListener("click", () => {
        chrome.tabs.create({
          url: `https://github.com/shahriyardx/assignment-checker/releases/tag/${latestVersion}`,
        })
      })
    }
  }
}

main()
