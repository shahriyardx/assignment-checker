import { useCallback, useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [currentPath])

  return currentPath
}

export type LocalSettings = {
  copyMarks?: boolean
  openAssignmentShortcut?: Record<any, any>
  submitMarksShortcut?: Record<any, any>
  insertFeedbackShortcut?: Record<any, any>
  showFeedbackBuilder?: Record<any, any>
}

export const getSettings = async () => {
  const settings = await storage.getItem("settings")
  if (settings) {
    return JSON.parse(settings) as LocalSettings
  }

  return {} as LocalSettings
}

export const useExtensionSettings = () => {
  const [settings, setSettings] = useState<LocalSettings>({
    copyMarks: false,
  })

  const loadSettings = useCallback(async () => {
    const localSettings = await storage.getItem("settings")
    if (!localSettings) {
      setSettings(() => ({
        copyMarks: false,
      }))
    } else {
      setSettings(() => JSON.parse(localSettings) as LocalSettings)
    }
  }, [])

  const updateSettings = async (updatedSettings: LocalSettings) => {
    const newSettings: LocalSettings = {
      ...settings,
      ...updatedSettings,
    }

    await storage.setItem("settings", JSON.stringify(newSettings))
    setSettings(() => newSettings)
  }

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return { settings, updateSettings }
}
