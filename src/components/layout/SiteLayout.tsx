import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Shared page frame: header, routed content, footer.
 * Scroll position resets on navigation (hash routing keeps the browser
 * from doing this automatically).
 */
export function SiteLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      {/* A plain #anchor href would be treated as a route by HashRouter. */}
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to main content
      </button>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
