import { ref } from 'vue'
import type { CityResult } from '@/types/geocoding'

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'

export function useGeocoding() {
  const results = ref<CityResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function searchCity(query: string) {
    if (query.length < 2) {
      results.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        name: query,
        count: '5',
        language: 'pt',
        format: 'json',
      })

      const response = await fetch(`${GEOCODING_API}?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to search: ${response.statusText}`)
      }

      const data = await response.json() as { results?: Array<{ name: string; admin1?: string; country?: string; latitude: number; longitude: number }> }

      results.value = (data.results || []).map((r) => ({
        name: r.name,
        state: r.admin1 || '',
        country: r.country || '',
        latitude: r.latitude,
        longitude: r.longitude,
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  return { results, loading, error, searchCity }
}
