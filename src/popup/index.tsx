import { useState } from "react"

import "@/styles.css"

import { getCurrentVersion } from "@/utils"
import Home from "./pages/Home"
import Update from "./pages/Update"

const pages = ["Settings", "Update"] as const
type Page = (typeof pages)[number]

function IndexPopup() {
  const [currentPage, setCurrentPage] = useState<Page>("Settings")

  return (
    <div className="w-[340px] h-[460px] flex flex-col font-mono bg-white text-[#1b1f27]">
      <header className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-[#e3e6eb]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6807ff]" />
        <h1 className="flex-1 text-[11px] font-bold tracking-[0.14em] uppercase">
          Assignment Checker
        </h1>
        <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-[#edeff3] text-[#6b7280]">
          {getCurrentVersion()}
        </span>
      </header>

      <nav className="flex gap-1 px-3 pt-2 border-b border-[#e3e6eb]">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`
              px-2.5 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase
              border-b-2 -mb-px transition-colors
              ${
                page === currentPage
                  ? "border-[#6807ff] text-[#6807ff]"
                  : "border-transparent text-[#6b7280] hover:text-[#1b1f27]"
              }
            `}
          >
            {page}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4 overflow-y-auto">
        {currentPage === "Settings" && <Home />}
        {currentPage === "Update" && <Update />}
      </main>
    </div>
  )
}

export default IndexPopup
