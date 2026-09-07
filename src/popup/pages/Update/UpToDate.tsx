import moment from "moment"

import type { VersionInfo } from "./useVersion"

const UpToDate = ({ versionInfo }: { versionInfo: VersionInfo }) => {
  const { currentVersion, lastUpdateCheck } = versionInfo

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase">
          Up to date
        </h2>
      </div>

      <dl className="flex flex-col gap-1.5 text-[11px]">
        <div className="flex justify-between gap-3">
          <dt className="text-[#6b7280]">Installed</dt>
          <dd>{currentVersion}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#6b7280]">Last checked</dt>
          <dd>
            {lastUpdateCheck
              ? moment(lastUpdateCheck).format("MMM Do, h:mm A")
              : "—"}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default UpToDate
