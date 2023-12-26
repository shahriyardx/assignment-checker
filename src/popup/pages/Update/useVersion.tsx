import { getCurrentVersion, getLatestVersionInfo } from "@/utils"
import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export type VersionInfo = {
  latestVersion: string | null
  changelog: string | null
  loading: boolean
  currentVersion: string
  lastUpdateCheck?: Date
}

const storage = new Storage({ area: "local" })

const useVersion = () => {
  const [lastUpdateCheck] = useStorage({
    key: "lastUpdateCheck",
    instance: storage,
  })

  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    latestVersion: null,
    changelog: null,
    loading: true,
    currentVersion: getCurrentVersion(),
  })

  const getUpdateInfo = async (force: boolean = false) => {
    const { latestVersion, changelog } = await getLatestVersionInfo(force)

    setVersionInfo({
      ...versionInfo,
      latestVersion: latestVersion,
      changelog,
      loading: false,
      lastUpdateCheck: lastUpdateCheck ? new Date(lastUpdateCheck) : new Date(),
    })
  }

  const refetch = () => {
    setVersionInfo({ ...versionInfo, loading: true })
    getUpdateInfo(true)
  }

  useEffect(() => {
    storage.getItem("latestVersion").then((value) => {
      if (!value) {
        return getUpdateInfo(true)
      }
      getUpdateInfo()
    })
  }, [])

  return { ...versionInfo, refetch }
}

export default useVersion
