import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import cssText from "data-text:@/styles.css"

import {
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Eye,
  Focus,
  Save,
} from "lucide-react"

import { insertFeedback } from "./scripts/feedback"
import { showFeedbackBuilder } from "./scripts/html_helper"
import { openFirstAssignment, submitMarks } from "./scripts/utils"

import { RELEASE_URL } from "@/utils"
import { allowedPaths } from "./scripts/events"

import useVersion from "@/popup/pages/Update/useVersion"

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

const Tools = () => {
  const versionInfo = useVersion()
  const [open, setOpen] = useState(false)

  return (
    <div className={"fixed right-0 -translate-y-1/2 top-1/2"}>
      <div className="absolute -translate-y-1/2 top-1/2 right-full">
        <button
          type="button"
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
            type="button"
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
            type="button"
            className="relative hover:bg-zinc-700 group"
            onClick={insertFeedback}
          >
            <Focus /> <span>Insert</span>
            <ShortCut text="Shift + ]" />
          </button>
          <button
            type="button"
            className="relative hover:bg-zinc-700 rounded-bl-md group"
            onClick={submitMarks}
          >
            <Save /> <span>Submit</span>
            <ShortCut text="Shift + Enter" />
          </button>

          {versionInfo.latestVersion &&
            versionInfo.currentVersion !== versionInfo.latestVersion && (
              <button
                type="button"
                className="relative hover:bg-zinc-700 rounded-bl-md group"
                onClick={() =>
                  chrome.runtime.sendMessage({
                    action: "createTab",
                    url: `${RELEASE_URL}`,
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
export const config: PlasmoCSConfig = {
  matches: ["https://web.programming-hero.com/instructor-dashboard/*"],
  all_frames: true,
}

export default Tools

export {}
