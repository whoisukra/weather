<script setup lang="ts">
import { computed } from 'vue'
import { getWeatherInfo } from '@/utils/weatherCode'

const props = defineProps<{
  code: number
  size?: 'sm' | 'md' | 'lg'
}>()

const info = computed(() => getWeatherInfo(props.code))

const sizeClasses = computed(() => ({
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}[props.size ?? 'md']))
</script>

<template>
  <div :class="sizeClasses">
    <!-- Sun -->
    <svg v-if="info.icon === 'sun'" class="text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Sun with cloud -->
    <svg v-else-if="info.icon === 'sun-cloud'" class="text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <path class="text-amber-400" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m5-1l.707.707M16.5 5.5l-1 1" />
    </svg>
    <!-- Cloud -->
    <svg v-else-if="info.icon === 'cloud'" class="text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
    <!-- Cloud with rain -->
    <svg v-else-if="info.icon === 'cloud-rain'" class="text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 21v-2m4 2v-3m4 3v-2" />
    </svg>
    <!-- Cloud with heavy rain -->
    <svg v-else-if="info.icon === 'cloud-heavy-rain'" class="text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M7 21v-2m5 2v-3m5 3v-2" />
    </svg>
    <!-- Cloud with snow -->
    <svg v-else-if="info.icon === 'cloud-snow'" class="text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <circle cx="8" cy="21" r="0.5" fill="currentColor" />
      <circle cx="12" cy="20" r="0.5" fill="currentColor" />
      <circle cx="16" cy="21" r="0.5" fill="currentColor" />
    </svg>
    <!-- Cloud with lightning -->
    <svg v-else-if="info.icon === 'cloud-lightning'" class="text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 17l-3 4h4l-2 3" />
    </svg>
    <!-- Fog -->
    <svg v-else-if="info.icon === 'fog'" class="text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10M9 23h6" />
    </svg>
    <!-- Default cloud -->
    <svg v-else class="text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  </div>
</template>
