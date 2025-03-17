import React from "react"
import type { VersionInfo } from "./useVersion"

import { RELEASE_URL } from "@/utils"

const NewVersionAvailable = ({ versionInfo }: { versionInfo: VersionInfo }) => {
  const { latestVersion } = versionInfo

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold">⬇ Update Available</h3>
      <p>{latestVersion}</p>
      <div className="mt-3">
        <button
          type="button"
          onClick={() =>
            chrome.tabs.create({
              url: RELEASE_URL,
            })
          }
          className="px-3 py-2 bg-indigo-500 text-white rounded-md"
        >
          Download
        </button>
      </div>
    </div>
  )
}

export default NewVersionAvailable
