<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherResponse } from '@/types/weather'
import ForecastRow from './ForecastRow.vue'
import WeatherIcon from './WeatherIcon.vue'
import WeatherDetails from './WeatherDetails.vue'
import TemperatureChart from './TemperatureChart.vue'
import { getWeatherInfo } from '@/utils/weatherCode'
import { useUnit } from '@/composables/useUnit'

const props = defineProps<{
  weather: WeatherResponse
}>()

const { convert, symbol } = useUnit()

function formatCurrentTime(timeStr: string): string {
  const [datePart, timePart] = timeStr.split('T')
  if (!datePart || !timePart) return timeStr
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  const d = new Date(year!, month! - 1, day!, hour!, minute!)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatCurrentDate(timeStr: string): string {
  const [datePart] = timeStr.split('T')
  if (!datePart) return timeStr
  const [year, month, day] = datePart.split('-').map(Number)
  const d = new Date(year!, month! - 1, day!)
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

const currentTime = computed(() => formatCurrentTime(props.weather.current.time))
const currentDate = computed(() => formatCurrentDate(props.weather.current.time))
const currentCondition = computed(() => getWeatherInfo(props.weather.current.weatherCode))
const displayTemp = computed(() => convert(props.weather.current.temperature).toFixed(1))
</script>

<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="animate-fade-in card-bg-strong rounded-3xl bg-gradient-to-b from-black/[0.02] to-transparent p-8 glow dark:from-white/[0.08] dark:to-white/[0.02]">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-subtle">
            {{ weather.city }}
          </p>
          <p class="text-xs text-muted">{{ weather.state }}, Brasil</p>
        </div>
        <div class="rounded-lg bg-black/[0.05] px-2.5 py-1 dark:bg-white/[0.08]">
          <p class="text-[10px] font-medium uppercase tracking-wider text-muted">Agora</p>
        </div>
      </div>

      <div class="mt-6 flex items-end justify-between">
        <div>
          <div class="flex items-end gap-3">
            <p class="text-7xl font-semibold tracking-tight text-gradient">
              {{ displayTemp }}
            </p>
            <p class="mb-2 text-2xl font-medium text-muted">{{ symbol() }}</p>
          </div>
        </div>
        <div class="text-right">
          <WeatherIcon :code="weather.current.weatherCode" size="lg" />
          <p class="mt-2 text-sm text-subtle">{{ currentCondition.label }}</p>
        </div>
      </div>

      <div class="mt-6 flex items-center gap-4 border-t divider pt-4">
        <div class="flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs text-muted">
            {{ currentTime }}
          </p>
        </div>
        <span class="text-faint">|</span>
        <p class="text-xs text-muted">
          {{ currentDate }}
        </p>
      </div>
    </div>

    <TemperatureChart v-if="weather.hourly.length" :hourly="weather.hourly" />

    <div class="space-y-3">
      <div class="flex items-center gap-3 px-1">
        <h3 class="text-sm font-medium text-subtle">Detalhes</h3>
        <div class="h-px flex-1 bg-gray-100 dark:bg-white/[0.06]" />
      </div>
      <WeatherDetails :details="weather.details" />
    </div>

    <div class="animate-fade-in-delay space-y-4">
      <div class="flex items-center gap-3 px-1">
        <h3 class="text-sm font-medium text-subtle">Previsão 3 dias</h3>
        <div class="h-px flex-1 bg-gray-100 dark:bg-white/[0.06]" />
      </div>

      <div class="space-y-2">
        <ForecastRow
          v-for="(day, index) in weather.forecast"
          :key="day.date"
          :forecast="day"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>
