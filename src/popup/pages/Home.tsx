import type React from "react"

import { useExtensionSettings } from "@/hooks"
import { DEFAULT_SHORTCUTS, type Keymap, type ShortcutName } from "@/utils"
import ShortcutInput from "../components/ShortcutInput"
import Toggle from "../components/Toggle"

const SHORTCUT_NAMES: ShortcutName[] = [
  "openAssignmentShortcut",
  "showFeedbackBuilder",
  "insertFeedbackShortcut",
  "submitMarksShortcut",
]

const Label = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2.5 mb-3 text-[9px] font-bold tracking-[0.16em] uppercase text-[#6b7280] after:content-[''] after:flex-1 after:h-px after:bg-[#e3e6eb]">
    {children}
  </h2>
)

const Home = () => {
  const { settings, updateSettings, loading } = useExtensionSettings()

  if (loading) {
    return <p className="text-[11px] text-[#6b7280]">Loading settings…</p>
  }

  // a combo assigned to two actions would make one of them unreachable
  const assigned = SHORTCUT_NAMES.map(
    (name) => settings[name]?.text ?? DEFAULT_SHORTCUTS[name],
  )
  const duplicates = new Set(
    assigned.filter((text, index) => assigned.indexOf(text) !== index),
  )

  return (
    <div className="flex flex-col gap-6">
      <section>
        <Label>Behaviour</Label>
        <div className="flex flex-col gap-3">
          <Toggle
            id="copy_marks"
            label="Copy marks to clipboard"
            checked={settings.copyMarks}
            onChange={(checked) => updateSettings({ copyMarks: checked })}
          />
          <Toggle
            id="open_links"
            label="Open submission links automatically"
            checked={settings.openLinks}
            onChange={(checked) => updateSettings({ openLinks: checked })}
          />
        </div>
      </section>

      <section>
        <Label>Shortcuts</Label>
        <div className="flex flex-col gap-2.5">
          {SHORTCUT_NAMES.map((name) => (
            <ShortcutInput
              key={name}
              name={name}
              value={settings[name]}
              conflict={duplicates.has(
                settings[name]?.text ?? DEFAULT_SHORTCUTS[name],
              )}
              onChange={(keymap: Keymap | null) =>
                updateSettings({ [name]: keymap ?? undefined })
              }
            />
          ))}
        </div>

        {duplicates.size > 0 && (
          <p className="mt-3 text-[10px] text-[#b91c1c]">
            Two actions share a shortcut. Only one of them will fire.
          </p>
        )}

        <p className="mt-3 text-[10px] text-[#6b7280]">
          Click a shortcut, then press the keys. Esc cancels.
        </p>
      </section>

      <section>
        <Label>Loader</Label>
        <p className="text-[10px] text-[#6b7280]">
          Press{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] rounded border border-[#d2d7df] bg-white">
            Shift
          </kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] rounded border border-[#d2d7df] bg-white">
            \
          </kbd>{" "}
          on the dashboard to load JSON files.
        </p>
      </section>
    </div>
  )
}

export default Home
