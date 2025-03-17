import moment from "moment"
import React from "react"
import type { VersionInfo } from "./useVersion"

const UpToDate = ({
  versionInfo,
}: {
  versionInfo: VersionInfo
}) => {
  const { latestVersion, lastUpdateCheck } = versionInfo

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold">Already up to date ⚡️</h3>

      <p className="mt-2">
        <span className="text-white">Current Version:</span> {
          latestVersion
        }{" "}
      </p>
      <p>
        <span className="text-white">Last Update Check:</span>{" "}
        {moment(lastUpdateCheck).format("MMM Do, YYYY, h:mm A")}
      </p>
    </div>
  )
}

export default UpToDate
