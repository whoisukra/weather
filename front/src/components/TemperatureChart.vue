<script setup lang="ts">
import { computed } from 'vue'
import type { HourlyForecast } from '@/types/weather'
import { useUnit, celsiusToFahrenheit } from '@/composables/useUnit'

const props = defineProps<{
  hourly: HourlyForecast[]
}>()

const { unit } = useUnit()

const chartData = computed(() => {
  const points = props.hourly.slice(0, 12)
  if (points.length === 0) return { path: '', areaPath: '', points: [], width: 400, height: 80, min: 0, max: 0 }

  const temps = points.map((p) =>
    unit.value === 'F' ? celsiusToFahrenheit(p.temperature) : p.temperature,
  )
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = max - min || 1

  const width = 400
  const height = 80
  const padding = 10
  const stepX = (width - padding * 2) / (temps.length - 1 || 1)

  const points_svg = temps.map((temp, i) => {
    const x = padding + i * stepX
    const y = height - padding - ((temp - min) / range) * (height - padding * 2)
    return { x, y, temp: temp.toFixed(0), label: new Date(points[i]!.time).getHours().toString().padStart(2, '0') }
  })

  const path = points_svg
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ')

  const areaPath = `${path} L${points_svg[points_svg.length - 1]!.x},${height} L${points_svg[0]!.x},${height} Z`

  return {
    path,
    areaPath,
    points: points_svg,
    width,
    height,
    min,
    max,
  }
})
</script>

<template>
  <div class="card-bg rounded-2xl p-4">
    <div class="mb-3 flex items-center justify-between">
      <h4 class="text-xs font-medium text-subtle">Próximas 12 horas</h4>
      <span class="text-[10px] text-muted">{{ chartData.min.toFixed(0) }}° / {{ chartData.max.toFixed(0) }}°</span>
    </div>
    <svg :viewBox="`0 0 ${chartData.width} ${chartData.height}`" class="h-20 w-full">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgb(99 102 241)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="rgb(99 102 241)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path v-if="chartData.areaPath" :d="chartData.areaPath" fill="url(#chartGradient)" />
      <path v-if="chartData.path" :d="chartData.path" fill="none" stroke="rgb(99 102 241)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <g v-for="p in chartData.points" :key="p.x">
        <circle :cx="p.x" :cy="p.y" r="2" fill="rgb(99 102 241)" />
        <text :x="p.x" :y="chartData.height - 2" text-anchor="middle" class="fill-gray-400 dark:fill-white/30" font-size="7">{{ p.label }}h</text>
      </g>
    </svg>
  </div>
</template>
