import { useState } from "react"

import "@/styles.css"

import Home from "./pages/Home"
import Update from "./pages/Update"

const pages = ["Home", "Update"]

function IndexPopup() {
  const [currentPage, setCurrentPage] = useState("Home")

  return (
    <div className="w-[300px] h-[400px] bg-zinc-700 text-zinc-200">
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 h-[50px]">
        {pages.map((page, index) => (
          <button
            type="button"
            key={`${index}_n`}
            onClick={() => setCurrentPage(page)}
            className={`${
              page === currentPage ? "text-indigo-300" : "text-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="w-full h-[350px] bg-zinc-700 overflow-y-auto">
        <main className="p-3 overflow-y-auto">
          {currentPage === "Home" && <Home />}
          {currentPage === "Update" && <Update />}
        </main>
      </div>
    </div>
  )
}

export default IndexPopup
