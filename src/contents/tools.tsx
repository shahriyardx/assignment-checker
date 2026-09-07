import cssText from "data-text:@/styles.css"
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  MessageSquare,
  Send,
  Upload,
  X,
} from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import React, {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { insertFeedback } from "./scripts/feedback"
import { showFeedbackBuilder } from "./scripts/html_helper"
import {
  activateJson,
  addJsonFiles,
  getActiveFilename,
  getJsons,
  removeJson,
  subscribeToJsons,
} from "./scripts/json-store"
import { showNotice } from "./scripts/notice"
import type { JsonData } from "./scripts/types"
import { openFirstAssignment, submitMarks } from "./scripts/utils"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const useJsons = () => {
  const [jsons, setJsons] = useState<JsonData[]>([])
  const [active, setActive] = useState<string | null>(null)

  const sync = useCallback(() => {
    setJsons(getJsons())
    setActive(getActiveFilename())
  }, [])

  useEffect(() => {
    sync()
    return subscribeToJsons(sync)
  }, [sync])

  return { jsons, active }
}

const Tools = () => {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const { jsons, active } = useJsons()
  const fileInput = useRef<HTMLInputElement>(null)

  const onFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length === 0) return

    const rejected = await addJsonFiles(files)
    event.target.value = ""

    if (rejected.length > 0) {
      showNotice(`Not valid JSON: ${rejected.join(", ")}`, "error")
    }
  }

  return (
    <div className="fixed top-0 right-0 z-[2147483000] flex flex-col items-end font-mono">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Hide tools" : "Show tools"}
        className={`
          relative z-10 flex items-center gap-1.5 px-3.5 py-2
          text-[10px] font-bold tracking-[0.12em] uppercase text-white
          transition-colors
          ${open ? "rounded-bl-none" : "rounded-bl-xl"}
        `}
        style={{
          background: hover ? "#23262e" : "#000000",
          boxShadow: "0 6px 20px -6px rgba(0,0,0,0.45)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        Tools
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div
          className="w-64 overflow-hidden rounded-bl-xl"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #d2d7df",
            borderLeft: "1px solid #d2d7df",
            boxShadow:
              "0 16px 40px -12px rgba(16,24,40,0.35), 0 2px 8px rgba(16,24,40,0.10)",
          }}
        >
          <SectionLabel>Actions</SectionLabel>

          <ToolButton
            icon={<FolderOpen size={13} />}
            onClick={() => {
              openFirstAssignment(() =>
                setTimeout(() => showFeedbackBuilder(), 100),
              )
            }}
          >
            Open assignment
          </ToolButton>

          <ToolButton
            icon={<MessageSquare size={13} />}
            onClick={insertFeedback}
          >
            Insert feedback
          </ToolButton>

          <ToolButton icon={<Send size={13} />} onClick={submitMarks}>
            Submit marks
          </ToolButton>

          <SectionLabel>
            JSON
            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-[#edeff3] text-[#6b7280] normal-case tracking-normal">
              {jsons.length}
            </span>
          </SectionLabel>

          <div className="max-h-48 overflow-y-auto">
            {jsons.length === 0 ? (
              <p className="px-3 py-2.5 text-[10.5px] text-[#6b7280]">
                Nothing loaded yet.
              </p>
            ) : (
              jsons.map((json) => {
                const isActive = json.filename === active

                return (
                  <div
                    key={json.filename}
                    className="flex items-center gap-1.5 px-3 py-1.5"
                    style={{
                      borderTop: "1px solid #eef0f3",
                      background: isActive ? "#f4efff" : "transparent",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => activateJson(json)}
                      title={json.filename}
                      className={`
                        flex-1 min-w-0 text-left text-[10.5px] truncate transition-colors
                        ${
                          isActive
                            ? "text-[#6807ff] font-bold"
                            : "text-[#1b1f27] hover:text-[#6807ff]"
                        }
                      `}
                    >
                      {isActive ? "● " : "○ "}
                      {json.filename}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeJson(json.filename)}
                      aria-label={`Remove ${json.filename}`}
                      className="p-0.5 rounded text-[#6b7280] hover:text-[#dc2626] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <ToolButton
            icon={<Upload size={13} />}
            onClick={() => fileInput.current?.click()}
          >
            Load JSON…
          </ToolButton>

          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            multiple
            onChange={onFiles}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5 text-[9px] font-bold tracking-[0.16em] uppercase text-[#6b7280]">
    {children}
  </div>
)

type ToolButtonProps = ComponentProps<"button"> & {
  icon: React.ReactNode
}

const ToolButton = ({
  children,
  icon,
  className,
  ...props
}: ToolButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={`
        group flex items-center w-full gap-2.5 px-3 py-2
        text-[11px] text-left text-[#1b1f27]
        hover:bg-[#6807ff] hover:text-white
        focus-visible:outline-none focus-visible:bg-[#6807ff] focus-visible:text-white
        transition-colors
        ${className ?? ""}
      `}
      style={{ borderTop: "1px solid #eef0f3" }}
    >
      <span className="text-[#6b7280] group-hover:text-white">{icon}</span>
      {children}
    </button>
  )
}

export const config: PlasmoCSConfig = {
  // the bare path needs its own pattern: "/instructor-dashboard/*" does not
  // match "/instructor-dashboard"
  matches: [
    "https://web.programming-hero.com/instructor-dashboard",
    "https://web.programming-hero.com/instructor-dashboard/*",
  ],
  all_frames: true,
}

export default Tools

export {}
