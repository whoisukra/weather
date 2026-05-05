<script setup lang="ts">
import type { WeatherDetails } from '@/types/weather'
import { useUnit, celsiusToFahrenheit } from '@/composables/useUnit'

const props = defineProps<{
  details: WeatherDetails
}>()

const { unit, convert } = useUnit()

const windDirection = (deg: number): string => {
  const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

const sunriseTime = (iso: string): string => {
  if (!iso) return '--:--'
  const [, time] = iso.split('T')
  if (!time) return '--:--'
  const [h, m] = time.split(':')
  return `${h}:${m}`
}

const sunsetTime = (iso: string): string => {
  if (!iso) return '--:--'
  const [, time] = iso.split('T')
  if (!time) return '--:--'
  const [h, m] = time.split(':')
  return `${h}:${m}`
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Umidade</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ details.humidity }}%</p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Vento</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ details.windSpeed.toFixed(0) }} <span class="text-sm font-normal text-muted">km/h {{ windDirection(details.windDirection) }}</span></p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">UV Index</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ details.uvIndex.toFixed(1) }}</p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Pressão</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ details.pressure.toFixed(0) }} <span class="text-sm font-normal text-muted">hPa</span></p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-3-7v18" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Nascer do Sol</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ sunriseTime(details.sunrise) }}</p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m3-7v18" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Pôr do Sol</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ sunsetTime(details.sunset) }}</p>
    </div>

    <div class="card-bg rounded-2xl p-4">
      <div class="mb-2 flex items-center gap-1.5">
        <svg class="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-[10px] font-medium uppercase tracking-wider text-muted">Sensação</span>
      </div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ convert(details.apparentTemperature).toFixed(0) }}<span class="text-sm font-normal text-muted">{{ unit === 'F' ? '°F' : '°C' }}</span></p>
    </div>
  </div>
</template>
