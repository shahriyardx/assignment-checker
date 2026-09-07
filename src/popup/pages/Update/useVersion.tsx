import { useCallback, useEffect, useState } from "react"

import { getCurrentVersion, getLatestVersionInfo } from "@/utils"

export type VersionInfo = {
  latestVersion: string | null
  changelog: string | null
  currentVersion: string | null
  error: string | null
  loading: boolean
  lastUpdateCheck: Date | null
}

const useVersion = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    latestVersion: null,
    changelog: null,
    currentVersion: null,
    error: null,
    loading: true,
    lastUpdateCheck: null,
  })

  const getUpdateInfo = useCallback(async () => {
    const { latestVersion, changelog, error } = await getLatestVersionInfo()

    setVersionInfo({
      currentVersion: getCurrentVersion(),
      latestVersion,
      changelog,
      error,
      loading: false,
      lastUpdateCheck: new Date(),
    })
  }, [])

  useEffect(() => {
    getUpdateInfo()
  }, [getUpdateInfo])

  return { ...versionInfo, refresh: getUpdateInfo }
}

export default useVersion
