import { useState } from "react"

import "@/styles.css"

import Home from "./pages/Home"
import Update from "./pages/Update"

const pages = ["Home", "Update"]

function IndexPopup() {
  const [currentPage, setCurrentPage] = useState("Home")

  return (
    <div className="w-[300px] h-[200px] bg-zinc-700 text-zinc-200">
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800">
        {pages.map((page) => (
          <button
            onClick={() => setCurrentPage(page)}
            className={`${
              page === currentPage ? "text-indigo-300" : "text-white"
            }`}>
            {page}
          </button>
        ))}
      </div>

      <main className="p-3 h-[166px]">
        {currentPage == "Home" && <Home />}
        {currentPage == "Update" && <Update />}
      </main>
    </div>
  )
}

export default IndexPopup
