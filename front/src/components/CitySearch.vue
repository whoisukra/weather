<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { CityResult } from '@/types/geocoding'
import { useGeocoding } from '@/composables/useGeocoding'

const emit = defineEmits<{
  select: [city: CityResult]
  locate: []
}>()

const isOpen = ref(false)
const query = ref('')
const inputRef = ref<HTMLInputElement>()
const { results, loading, error, searchCity } = useGeocoding()
let debounceTimer: ReturnType<typeof setTimeout>

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchCity(value)
  }, 300)
})

watch(isOpen, async (value) => {
  if (value) {
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    results.value = []
    error.value = null
  }
})

function selectCity(city: CityResult) {
  emit('select', city)
  isOpen.value = false
}

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}

function useMyLocation() {
  emit('locate')
  isOpen.value = false
}
</script>

<template>
  <div class="flex gap-2">
    <!-- Search trigger button -->
    <button
      class="flex-1 rounded-xl border border-black/[0.08] bg-black/[0.04] px-4 py-2.5 text-left text-sm text-gray-400 transition hover:bg-black/[0.08] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/30 dark:hover:bg-white/[0.12]"
      @click="openModal"
    >
      <span class="flex items-center gap-2">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar cidade...
      </span>
    </button>

    <!-- Location button -->
    <button
      class="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-black/[0.04] px-4 py-2.5 text-sm text-gray-600 transition hover:bg-black/[0.08] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/60 dark:hover:bg-white/[0.12]"
      @click="useMyLocation"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <!-- Modal overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm dark:bg-black/80" @click="closeModal" />

          <!-- Modal content -->
          <div class="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.1] dark:bg-[#141414]">
            <!-- Search input -->
            <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-white/[0.06]">
              <svg class="h-5 w-5 text-gray-400 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="Digite o nome da cidade..."
                class="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-white/30"
                @keydown.escape="closeModal"
              />
              <svg v-if="loading" class="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <button v-else class="text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/50" @click="closeModal">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Results -->
            <div class="max-h-80 overflow-y-auto py-1">
              <p v-if="error && !loading" class="px-4 py-3 text-xs text-red-400">
                {{ error }}
              </p>

              <p v-if="!loading && query.length >= 2 && results.length === 0" class="px-4 py-6 text-center text-sm text-gray-400 dark:text-white/30">
                Nenhuma cidade encontrada
              </p>

              <button
                v-for="city in results"
                :key="`${city.latitude}-${city.longitude}`"
                type="button"
                class="block w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-white/80 dark:hover:bg-white/[0.06]"
                @click="selectCity(city)"
              >
                <span class="font-medium">{{ city.name }}</span>
                <span class="ml-1 text-xs text-gray-400 dark:text-white/30">
                  {{ city.state ? `, ${city.state}` : '' }} {{ city.country }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-leave-active .relative {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-enter-from .relative {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}
</style>
