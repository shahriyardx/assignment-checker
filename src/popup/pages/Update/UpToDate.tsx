import React from "react"

import type { VersionInfo } from "./useVersion"

const UpToDate = ({
  versionInfo
}: {
  versionInfo: VersionInfo & { refetch: () => void }
}) => {
  const { latestVersion, lastUpdateCheck, refetch } = versionInfo

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold">Already up to date</h3>

      <p>
        <span className="text-white">Current Version:</span> {latestVersion}{" "}
      </p>
      <p>Last Update Check: {lastUpdateCheck?.toISOString()}</p>

      <div className="mt-auto">
        <button
          onClick={() => refetch()}
          className="px-3 py-2 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-md">
          Check Update
        </button>
      </div>
    </div>
  )
}

export default UpToDate
