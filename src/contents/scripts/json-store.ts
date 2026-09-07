import type { JsonData } from "./types"

const JSONS_KEY = "assignment-jsons"
const ACTIVE_KEY = "assignment-data"
const CHANGE_EVENT = "ac:jsons-changed"

const readStored = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    // a corrupt entry should not take the whole panel down
    localStorage.removeItem(key)
    return fallback
  }
}

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT))

/** Lets the tools rail and the loader panel stay in sync with each other. */
export const subscribeToJsons = (listener: () => void) => {
  window.addEventListener(CHANGE_EVENT, listener)
  return () => window.removeEventListener(CHANGE_EVENT, listener)
}

export const getJsons = () => readStored<Array<JsonData>>(JSONS_KEY, [])

export const getActiveJson = () => readStored<JsonData | null>(ACTIVE_KEY, null)

export const getActiveFilename = () => getActiveJson()?.filename ?? null

export const activateJson = (json: JsonData) => {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(json))
  notify()
}

export const removeJson = (filename: string) => {
  const remaining = getJsons().filter((json) => json.filename !== filename)
  localStorage.setItem(JSONS_KEY, JSON.stringify(remaining))

  if (getActiveFilename() === filename) {
    localStorage.removeItem(ACTIVE_KEY)
  }

  notify()
}

/** Returns false when the file is not valid JSON, so callers can report it. */
export const addJson = (data: string, filename: string) => {
  let parsed: object

  try {
    parsed = JSON.parse(data)
  } catch {
    return false
  }

  const jsonData: JsonData = { filename, data: parsed }
  const remaining = getJsons().filter((json) => json.filename !== filename)
  remaining.push(jsonData)

  localStorage.setItem(JSONS_KEY, JSON.stringify(remaining))
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(jsonData))

  notify()
  return true
}

/** Reads files from an <input type="file"> and returns the rejected names. */
export const addJsonFiles = async (files: File[]) => {
  const rejected: string[] = []

  for (const file of files) {
    const data = await file.text()
    if (!addJson(data, file.name)) rejected.push(file.name)
  }

  return rejected
}
