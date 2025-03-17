import { getCurrentVersion, getLatestVersionInfo } from "@/utils"
import { useCallback, useEffect, useState } from "react"

export type VersionInfo = {
  latestVersion: string | null
  changelog: string | null
  loading: boolean
  currentVersion: string
  lastUpdateCheck?: Date
}

const useVersion = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    latestVersion: null,
    changelog: null,
    loading: true,
    currentVersion: null,
  })

  const getUpdateInfo = useCallback(async () => {
    const { latestVersion, changelog } = await getLatestVersionInfo()

    setVersionInfo({
      currentVersion: getCurrentVersion(),
      latestVersion: latestVersion,
      changelog,
      loading: false,
    })
  }, [])

  useEffect(() => {
    getUpdateInfo()
  }, [getUpdateInfo])

  return { ...versionInfo }
}

export default useVersion
