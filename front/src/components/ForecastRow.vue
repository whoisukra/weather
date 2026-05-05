<script setup lang="ts">
import { computed } from 'vue'
import type { DailyForecast } from '@/types/weather'
import WeatherIcon from './WeatherIcon.vue'
import { getWeatherInfo } from '@/utils/weatherCode'
import { useUnit } from '@/composables/useUnit'

const props = defineProps<{
  forecast: DailyForecast
  index: number
}>()

const { convert, symbol } = useUnit()

function formatDate(dateStr: string): { weekday: string; dayMonth: string } {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year!, month! - 1, day!)
  return {
    weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
    dayMonth: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
  }
}

const delayClass = computed(() => 'animate-slide-up')

const delayStyle = computed(() => ({
  animationDelay: `${0.3 + props.index * 0.1}s`,
  opacity: 0,
  animationFillMode: 'forwards',
}))

const formatted = computed(() => formatDate(props.forecast.date))
const condition = computed(() => getWeatherInfo(props.forecast.weatherCode))
const displayMin = computed(() => convert(props.forecast.temperatureMin).toFixed(0))
const displayMax = computed(() => convert(props.forecast.temperatureMax).toFixed(0))
</script>

<template>
  <div
    class="group row-bg flex items-center justify-between rounded-2xl px-4 py-3.5 transition"
    :class="delayClass"
    :style="delayStyle"
  >
    <div class="flex items-center gap-3">
      <WeatherIcon :code="forecast.weatherCode" size="sm" />
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-white/70">
          {{ formatted.weekday }}
        </p>
        <p class="text-[11px] text-gray-400 dark:text-white/30">
          {{ formatted.dayMonth }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">{{ displayMin }}°</span>
      <div class="h-8 w-px divider-faint" />
      <span class="text-sm font-medium text-orange-600/80 dark:text-orange-400/80">{{ displayMax }}°</span>
    </div>
  </div>
</template>
