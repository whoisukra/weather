import { ref, watchEffect } from 'vue'

const theme = ref<'light' | 'dark'>(
  typeof localStorage !== 'undefined'
    ? (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    : 'dark'
)

watchEffect(() => {
  const root = document.documentElement
  root.classList.toggle('dark', theme.value === 'dark')
  root.classList.toggle('light', theme.value === 'light')
  localStorage.setItem('theme', theme.value)
})

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}
