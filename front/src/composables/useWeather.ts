import { ref } from 'vue'
import type { WeatherResponse } from '@/types/weather'

export function useWeather() {
  const data = ref<WeatherResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWeather(params?: { lat: number; long: number; city: string; state: string }) {
    loading.value = true
    error.value = null

    try {
      const url = new URL('/api/weather', window.location.origin)

      if (params) {
        url.searchParams.set('lat', params.lat.toString())
        url.searchParams.set('long', params.long.toString())
        url.searchParams.set('city', params.city)
        url.searchParams.set('state', params.state)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`Failed to fetch weather: ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchWeather }
}
