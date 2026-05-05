<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WeatherCard from '@/components/WeatherCard.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import CitySearch from '@/components/CitySearch.vue'
import type { CityResult } from '@/types/geocoding'
import { useWeather } from '@/composables/useWeather'

const { data, loading, error, fetchWeather } = useWeather()
const geoError = ref<string | null>(null)

onMounted(() => {
  fetchWeather()
})

function handleCitySelect(city: CityResult) {
  fetchWeather({
    lat: city.latitude,
    long: city.longitude,
    city: city.name,
    state: city.state || city.country,
  })
}

function handleLocate() {
  if (!navigator.geolocation) {
    geoError.value = 'Geolocation is not supported by your browser'
    return
  }

  loading.value = true
  geoError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather({
        lat: position.coords.latitude,
        long: position.coords.longitude,
        city: 'Minha localização',
        state: '',
      })
    },
    () => {
      geoError.value = 'Unable to retrieve your location'
      loading.value = false
    },
  )
}
</script>

<template>
  <div class="relative min-h-screen transition-colors duration-300">
    <!-- Ambient glow -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden bg-ambient">
      <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
      <div class="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
    </div>

    <div class="relative mx-auto max-w-5xl px-6 py-12">
      <header class="mb-8 flex items-center justify-between animate-fade-in">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg icon-bg">
            <svg class="h-4 w-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-subtle">Gray Weather</span>
        </div>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
            class="group toggle-bg flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-subtle transition"
            @click="fetchWeather()"
          >
            <svg class="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
        </div>
      </header>

      <div class="mx-auto mb-12 max-w-lg animate-fade-in-delay">
        <CitySearch @select="handleCitySelect" @locate="handleLocate" />
        <p v-if="geoError" class="mt-2 text-xs text-red-400">{{ geoError }}</p>
      </div>

      <LoadingSkeleton v-if="loading" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchWeather()" />
      <WeatherCard v-else-if="data" :weather="data" />
    </div>
  </div>
</template>
