<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="rounded-3xl card-bg p-8">
      <div class="h-4 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
      <div class="mt-6 h-16 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
      <div class="mt-4 h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
    </div>

    <div class="space-y-3">
      <div v-for="n in 3" :key="n" class="row-bg flex items-center justify-between rounded-2xl p-4">
        <div class="h-4 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
        <div class="flex gap-6">
          <div class="h-4 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
          <div class="h-4 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>
