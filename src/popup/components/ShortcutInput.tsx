import { RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

import {
  DEFAULT_SHORTCUTS,
  getKeymap,
  isModifierKey,
  type Keymap,
  SHORTCUT_LABELS,
  type ShortcutName,
} from "@/utils"

type ShortcutInputProps = {
  name: ShortcutName
  value?: Keymap
  conflict?: boolean
  onChange: (keymap: Keymap | null) => void
}

const Keys = ({ text }: { text: string }) => (
  <span className="flex items-center gap-1">
    {text.split(" + ").map((key) => (
      <kbd
        key={key}
        className="px-1.5 py-0.5 text-[10px] rounded border border-[#d2d7df] bg-white text-[#1b1f27] shadow-[0_1px_0_#e3e6eb]"
      >
        {key}
      </kbd>
    ))}
  </span>
)

const ShortcutInput = ({
  name,
  value,
  conflict,
  onChange,
}: ShortcutInputProps) => {
  const [recording, setRecording] = useState(false)

  const fallback = DEFAULT_SHORTCUTS[name]
  const current = value?.text
  const isDefault = !current

  useEffect(() => {
    if (!recording) return

    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.key === "Escape") {
        setRecording(false)
        return
      }

      // wait for a real key, so holding Shift alone does not commit
      if (isModifierKey(event.key)) return

      onChange(getKeymap(event))
      setRecording(false)
    }

    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [recording, onChange])

  return (
    <div className="flex items-center gap-2">
      <span className="flex-1 text-[11px] text-[#4b5563]">
        {SHORTCUT_LABELS[name]}
      </span>

      <button
        type="button"
        onClick={() => setRecording((was) => !was)}
        aria-label={`Set shortcut for ${SHORTCUT_LABELS[name]}`}
        className={`
          flex items-center min-h-[26px] px-2 py-1 rounded-md border
          transition-colors
          ${
            recording
              ? "border-[#6807ff] bg-[#6807ff]/8 animate-pulse"
              : conflict
                ? "border-[#fca5a5] bg-[#fef2f2]"
                : "border-[#e3e6eb] bg-[#f7f8fa] hover:border-[#6807ff]"
          }
        `}
      >
        {recording ? (
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#6807ff]">
            Press keys
          </span>
        ) : (
          <span className={isDefault ? "opacity-55" : ""}>
            <Keys text={current ?? fallback} />
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setRecording(false)
          onChange(null)
        }}
        disabled={isDefault}
        title="Reset to default"
        aria-label={`Reset ${SHORTCUT_LABELS[name]} to default`}
        className="p-1 rounded text-[#6b7280] hover:text-[#6807ff] disabled:opacity-30 disabled:hover:text-[#6b7280] transition-colors"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  )
}

export default ShortcutInput
