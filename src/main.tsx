import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
// Side-effect: initializes i18next and sets <html lang> before first
// render, so the app never paints with a language/lang-attribute mismatch.
import './i18n'
import { initAnalytics } from './lib/analytics'
import App from './App.tsx'

const queryClient = new QueryClient()

// Once at app startup, not inside a component: initAnalytics() already
// guards against duplicate init, but calling it here (rather than from
// a render path) keeps it unambiguously a single startup step.
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
