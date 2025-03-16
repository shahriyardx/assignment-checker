import type { PlasmoCSConfig } from "plasmo"
import React, { useState, type ComponentProps } from "react"
import cssText from "data-text:@/styles.css"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { insertFeedback } from "./scripts/feedback"
import { showFeedbackBuilder } from "./scripts/html_helper"
import { openFirstAssignment, submitMarks } from "./scripts/utils"
import { useCurrentPath, useExtensionSettings } from "@/hooks"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Tools = () => {
  const [open, setOpen] = useState(false)
  const currentPath = useCurrentPath()

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
          <ToolButton
            onClick={() => {
              openFirstAssignment(() =>
                setTimeout(() => {
                  showFeedbackBuilder()
                }, 100),
              )
            }}
          >
            Open Assignment
          </ToolButton>
          <ToolButton
            type="button"
            className="relative hover:bg-zinc-700 group"
            onClick={insertFeedback}
          >
            Insert Feedback
          </ToolButton>
          <ToolButton
            type="button"
            className="relative hover:bg-zinc-700 rounded-bl-md group"
            onClick={submitMarks}
          >
            Submit
          </ToolButton>
        </div>
      )}
    </div>
  )
}

type ToolButtonProps = ComponentProps<"button">

const ToolButton = ({ children, ...props }: ToolButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className="px-3 py-2 hover:bg-zinc-600 rounded-md flex items-center gap-2 text-xs"
    >
      {children}
    </button>
  )
}

export const config: PlasmoCSConfig = {
  matches: ["https://web.programming-hero.com/instructor-dashboard/*"],
  all_frames: true,
}

export default Tools

export {}
