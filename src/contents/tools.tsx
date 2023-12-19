import React, { useEffect, useState } from "react"
import cssText from "data-text:@/styles.css"

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Focus,
  Save,
  DownloadCloud,
} from "lucide-react"
import { insertFeedback } from "./scripts/feedback"
import { showFeedbackBuilder } from "./scripts/html_helper"
import { openFirstAssignment, submitMarks } from "./scripts/utils"

import type { PlasmoCSConfig } from "plasmo"
import useVersion from "@/popup/pages/Update/useVersion"
import { RELEASE_URL } from "@/utils"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const ShortCut = ({ text }: { text: string }) => {
  return (
    <span
      className="
        absolute p-2 pointer-events-none text-white 
        bg-black right-[106px] whitespace-nowrap 
        rounded-md top-1/2 -translate-y-1/2 hidden 
        group-hover:block
      "
    >
      {text}
    </span>
  )
}

const allowedPaths = [
  "https://web.programming-hero.com/instructor-dashboard/assignments",
  "https://web.programming-hero.com/instructor-dashboard/my-assignment",
]

const Tools = () => {
  const versionInfo = useVersion()

  const [open, setOpen] = useState(false)
  const [showTools, setShowTools] = useState(false)

  useEffect(() => {
    if (allowedPaths.includes(window.location.href)) setShowTools(true)

    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.action === "urlChange") {
        if (allowedPaths.includes(request.url)) {
          setShowTools(true)
        } else {
          setShowTools(false)
        }
      }
      sendResponse({ received: true })
    })
  }, [])

  return (
    <div
      className={`fixed right-0 -translate-y-1/2 top-1/2 ${
        !showTools && "hidden"
      }`}
    >
      <div className="absolute -translate-y-1/2 top-1/2 right-full">
        <button
          className="py-5 text-white bg-zinc-900 rounded-l-md"
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      {open && (
        <div
          className="
            flex flex-col bg-zinc-800 text-white 
            rounded-l-md [&>button]:px-3 [&>button]:py-2 
            [&>button]:flex [&>button]:items-center [&>button]:gap-2
          "
        >
          <button
            className="relative hover:bg-zinc-700 rounded-tl-md group"
            onClick={() => {
              openFirstAssignment()
              setTimeout(() => {
                showFeedbackBuilder()
              }, 100)
            }}
          >
            <Eye /> <span>Open</span>
            <ShortCut text="Shift + O" />
          </button>
          <button
            className="relative hover:bg-zinc-700 group"
            onClick={insertFeedback}
          >
            <Focus /> <span>Insert</span>
            <ShortCut text="Shift + ]" />
          </button>
          <button
            className="relative hover:bg-zinc-700 rounded-bl-md group"
            onClick={submitMarks}
          >
            <Save /> <span>Submit</span>
            <ShortCut text="Shift + Enter" />
          </button>

          {versionInfo.latestVersion &&
            versionInfo.currentVersion !== versionInfo.latestVersion && (
              <button
                className="relative hover:bg-zinc-700 rounded-bl-md group"
                onClick={() =>
                  chrome.runtime.sendMessage({
                    action: "createTab",
                    url: `${RELEASE_URL}/${versionInfo.latestVersion}`,
                  })
                }
              >
                <DownloadCloud /> <span>Update</span>
              </button>
            )}
        </div>
      )}
    </div>
  )
}

export {}
export const config: PlasmoCSConfig = {
  matches: ["https://web.programming-hero.com/instructor-dashboard/*"],
  all_frames: true,
}

export default Tools
