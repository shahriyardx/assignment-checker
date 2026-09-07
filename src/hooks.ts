import { Storage } from "@plasmohq/storage"
import { useCallback, useEffect, useState } from "react"
import type { Keymap } from "@/utils"

const storage = new Storage({ area: "local" })

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setCurrentPath(window.location.pathname)
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return currentPath
}

export type LocalSettings = {
  copyMarks?: boolean
  openLinks?: boolean
  openAssignmentShortcut?: Keymap
  submitMarksShortcut?: Keymap
  insertFeedbackShortcut?: Keymap
  showFeedbackBuilder?: Keymap
}

const parseSettings = (raw: string | null | undefined): LocalSettings => {
  if (!raw) return {}

  try {
    return JSON.parse(raw) as LocalSettings
  } catch {
    return {}
  }
}

export const getSettings = async () => {
  const settings = await storage.getItem("settings")
  return parseSettings(settings)
}

export const useExtensionSettings = () => {
  const [settings, setSettings] = useState<LocalSettings>({ copyMarks: false })
  const [loading, setLoading] = useState(true)

  const loadSettings = useCallback(async () => {
    const localSettings = await storage.getItem("settings")
    setSettings(parseSettings(localSettings))
    setLoading(false)
  }, [])

  const updateSettings = async (updatedSettings: LocalSettings) => {
    const newSettings: LocalSettings = { ...settings, ...updatedSettings }

    await storage.setItem("settings", JSON.stringify(newSettings))
    setSettings(newSettings)
  }

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return { settings, updateSettings, loading }
}
