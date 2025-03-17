import { useExtensionSettings } from "@/hooks"
import React from "react"
import { debounce } from "lodash"
import { getKeymap } from "@/utils"

const Home = () => {
  const { settings, updateSettings } = useExtensionSettings()

  const handleKeymapChange = (event: KeyboardEvent, key: string) => {
    event.preventDefault()

    const handler = debounce(() => {
      const keyMap = getKeymap(event)
      updateSettings({ [key]: keyMap })
    }, 500)

    handler()
  }

  return (
    <div>
      <h1 className="text-xl font-bold border-b border-b-zinc-500">Settings</h1>
      <form className="mt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            checked={settings.copyMarks}
            onChange={(event) =>
              updateSettings({ copyMarks: event.target.checked })
            }
            id="copy_marks"
            type="checkbox"
          />
          <label htmlFor="copy_marks">Copy marks to clipboard</label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="copy_marks">Assignment Open Shortcut</label>
          <input
            id="copy_marks"
            type="text"
            onKeyDown={(event) =>
              // @ts-expect-error: unknown TODO: Fix type later
              handleKeymapChange(event, "openAssignmentShortcut")
            }
            value={settings.openAssignmentShortcut?.text || ""}
            className="px-3 py-2 rounded-md border-none bg-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="show_builder">Show Feedback Builder</label>
          <input
            id="show_builder"
            type="text"
            onKeyDown={(event) =>
              // @ts-expect-error: unknown TODO: Fix type later
              handleKeymapChange(event, "showFeedbackBuilder")
            }
            value={settings.showFeedbackBuilder?.text || ""}
            className="px-3 py-2 rounded-md border-none bg-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="insert_feedback">Insert Feedback Shortcut</label>
          <input
            id="insert_feedback"
            type="text"
            onKeyDown={(event) => {
              // @ts-expect-error: unknown TODO: Fix type later
              handleKeymapChange(event, "insertFeedbackShortcut")
            }}
            value={settings.insertFeedbackShortcut?.text || ""}
            className="px-3 py-2 rounded-md border-none bg-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="submit_marks">Submit Marks Shortcut</label>
          <input
            id="submit_marks"
            type="text"
            onKeyDown={(event) => {
              // TODO: Fix type later
              // @ts-expect-error: unknown
              handleKeymapChange(event, "submitMarksShortcut")
            }}
            value={settings.submitMarksShortcut?.text || ""}
            className="px-3 py-2 rounded-md border-none bg-zinc-600"
          />
        </div>
      </form>
    </div>
  )
}

export default Home
