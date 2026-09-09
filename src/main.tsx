import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { installVideoPlayer } from './vimeo'

installVideoPlayer()

if (window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 992px)').matches) {
  void import('./cursor.ts').then(({ installRecoveredInteractionLayer }) => {
    installRecoveredInteractionLayer()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
