import React from "react"

import NewVersionAvailable from "./NewVersionAvailable"
import UpToDate from "./UpToDate"
import useLatestVersion from "./useVersion"

const Update = () => {
  const versionInfo = useLatestVersion()

  if (versionInfo.loading) return <p>Loading...</p>

  return (
    <div className="h-full">
      {versionInfo.currentVersion == versionInfo.latestVersion ? (
        <UpToDate versionInfo={versionInfo} />
      ) : (
        <NewVersionAvailable versionInfo={versionInfo} />
      )}
    </div>
  )
}

export default Update
