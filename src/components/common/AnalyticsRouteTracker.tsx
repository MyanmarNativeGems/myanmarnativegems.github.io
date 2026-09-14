import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { buildTrackedPath, trackPageView } from '../../lib/analytics'

/**
 * Fires a GA4 page_view on every route change. Renders inside
 * <HashRouter> (so useLocation reflects the app's logical route, e.g.
 * "/gem/12", not the static "/index.html" GitHub Pages actually serves)
 * but outside any page component, so it never depends on a particular
 * page's own render tree.
 *
 * The page title is read one frame after the route commits — via
 * requestAnimationFrame rather than synchronously — so pages that set
 * document.title from an effect (see usePageMeta) have already done so
 * by the time this reads it.
 */
export function AnalyticsRouteTracker(): null {
  const location = useLocation()

  useEffect(() => {
    const path = buildTrackedPath(location.pathname, location.search)
    const frame = requestAnimationFrame(() => {
      trackPageView(path, document.title)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.search])

  return null
}
