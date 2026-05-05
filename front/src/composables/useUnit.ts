import { ref, watch } from 'vue'

const STORAGE_KEY = 'weather-unit'

function getInitialUnit(): 'C' | 'F' {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'F') return 'F'
  } catch {
    // ignore
  }
  return 'C'
}

const unit = ref<'C' | 'F'>(getInitialUnit())

watch(unit, (newVal) => {
  try {
    localStorage.setItem(STORAGE_KEY, newVal)
  } catch {
    // ignore
  }
})

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32
}

export function useUnit() {
  function toggle() {
    unit.value = unit.value === 'C' ? 'F' : 'C'
  }

  function convert(celsius: number): number {
    return unit.value === 'F' ? celsiusToFahrenheit(celsius) : celsius
  }

  function symbol(): string {
    return unit.value === 'F' ? '°F' : '°C'
  }

  return { unit, toggle, convert, symbol }
}
