import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .catch(() => {
        // PWA not available in dev or unsupported browser
      })
  })
}
