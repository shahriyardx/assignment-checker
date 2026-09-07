import { RELEASE_URL } from "@/utils"
import type { VersionInfo } from "./useVersion"

const NewVersionAvailable = ({ versionInfo }: { versionInfo: VersionInfo }) => {
  const { latestVersion, currentVersion, changelog } = versionInfo

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase">
          Update available
        </h2>
      </div>

      <p className="text-[11px] text-[#6b7280]">
        {currentVersion}{" "}
        <span className="text-[#1b1f27]">→ {latestVersion}</span>
      </p>

      {changelog && (
        <div className="p-2.5 max-h-[200px] overflow-y-auto text-[10.5px] leading-relaxed whitespace-pre-wrap rounded-md border border-[#e3e6eb] bg-[#f7f8fa] text-[#4b5563]">
          {changelog}
        </div>
      )}

      <button
        type="button"
        onClick={() => chrome.tabs.create({ url: RELEASE_URL })}
        className="px-3 py-2 text-[10px] font-bold tracking-[0.12em] uppercase text-white bg-[#6807ff] rounded-md hover:bg-[#5a06dd] transition-colors"
      >
        Download
      </button>
    </div>
  )
}

export default NewVersionAvailable
