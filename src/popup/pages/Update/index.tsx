import { isUpToDate } from "@/utils"
import NewVersionAvailable from "./NewVersionAvailable"
import UpToDate from "./UpToDate"
import useVersion from "./useVersion"

const Update = () => {
  const versionInfo = useVersion()

  if (versionInfo.loading) {
    return <p className="text-[11px] text-[#6b7280]">Checking for updates…</p>
  }

  if (versionInfo.error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-[11px] text-[#b91c1c]">{versionInfo.error}</p>
        <button
          type="button"
          onClick={versionInfo.refresh}
          className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-white bg-[#6807ff] rounded-md hover:bg-[#5a06dd] transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  return isUpToDate(versionInfo.currentVersion, versionInfo.latestVersion) ? (
    <UpToDate versionInfo={versionInfo} />
  ) : (
    <NewVersionAvailable versionInfo={versionInfo} />
  )
}

export default Update
