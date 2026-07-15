// Progress tracking for capstone modules (guided model-building exercises).

const KEY = 'findr_capstone_progress'

export type CapstoneEntry = { completed: boolean; completedDate: string | null; attempts: number }
type CapstoneMap = Record<string, CapstoneEntry>

function loadMap(): CapstoneMap {
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveMap(map: CapstoneMap) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function getCapstoneProgress(): CapstoneMap {
  return loadMap()
}

export function getCapstoneEntry(capstoneId: string): CapstoneEntry {
  const map = loadMap()
  return map[capstoneId] || { completed: false, completedDate: null, attempts: 0 }
}

export function recordCapstoneAttempt(capstoneId: string) {
  const map = loadMap()
  const prev = map[capstoneId] || { completed: false, completedDate: null, attempts: 0 }
  map[capstoneId] = { ...prev, attempts: prev.attempts + 1 }
  saveMap(map)
}

export function markCapstoneComplete(capstoneId: string) {
  const map = loadMap()
  const prev = map[capstoneId] || { completed: false, completedDate: null, attempts: 0 }
  map[capstoneId] = { ...prev, completed: true, completedDate: new Date().toISOString() }
  saveMap(map)
}
