import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Remove splash screen after mount
const splash = document.getElementById('splash-screen')
if (splash) {
  splash.style.opacity = '0'
  splash.style.transition = 'opacity 0.4s ease-out'
  setTimeout(() => splash.remove(), 400)
}
