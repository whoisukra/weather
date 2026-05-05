import { ref } from 'vue'

const STORAGE_KEY = 'weather-history'

export interface HistoryEntry {
  city: string
  state: string
  lat: number
  long: number
  searchedAt: number
}

const MAX_ENTRIES = 10

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as HistoryEntry[]
  } catch {
    // ignore
  }
  return []
}

function saveHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore
  }
}

const history = ref<HistoryEntry[]>(loadHistory())

export function useHistory() {
  function add(entry: Omit<HistoryEntry, 'searchedAt'>): void {
    const existingIndex = history.value.findIndex(
      (h) => h.lat === entry.lat && h.long === entry.long,
    )
    if (existingIndex >= 0) {
      history.value.splice(existingIndex, 1)
    }

    history.value.unshift({
      ...entry,
      searchedAt: Date.now(),
    })

    if (history.value.length > MAX_ENTRIES) {
      history.value = history.value.slice(0, MAX_ENTRIES)
    }

    saveHistory(history.value)
  }

  function remove(index: number): void {
    history.value.splice(index, 1)
    saveHistory(history.value)
  }

  function clear(): void {
    history.value = []
    saveHistory(history.value)
  }

  return { history, add, remove, clear }
}
