<script setup lang="ts">
import { computed } from 'vue'
import { useUnit } from '@/composables/useUnit'

const { unit, toggle, convert, symbol } = useUnit()
const unitLabel = computed(() => unit.value === 'F' ? '°F' : '°C')
</script>

<template>
  <button
    class="group toggle-bg flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-subtle transition hover:text-gray-900 dark:hover:text-white"
    @click="toggle"
    title="Toggle temperature unit"
  >
    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <span class="tabular-nums">{{ unitLabel }}</span>
  </button>
</template>
