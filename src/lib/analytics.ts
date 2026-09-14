/**
 * Minimal Google Analytics 4 (gtag.js) integration.
 *
 * Deliberately thin: a handful of typed functions around the standard
 * gtag.js snippet, not an analytics abstraction layer. Every function is
 * safe to call from anywhere — each no-ops quietly when there's no
 * measurement ID configured, when `window`/`document` aren't available
 * (SSR, build, tests), or before `initAnalytics()` has run.
 */

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined

const DEBUG_MODE = import.meta.env.VITE_GA_DEBUG === 'true'

let initialized = false

/** True in an actual browser tab; false during SSR, build, or in tests. */
function isBrowser(): boolean {
  return (
    !import.meta.env.SSR &&
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  )
}

/**
 * Loads gtag.js and configures GA4. Safe to call more than once — only
 * the first call does anything, so re-renders or repeated app-init code
 * paths never inject a second `<script>` tag or re-run `config`.
 *
 * `send_page_view: false` because this is a HashRouter SPA: automatic
 * pageviews would only ever see the physical GitHub Pages path ("/"),
 * so page views are sent explicitly on route change instead (see
 * AnalyticsRouteTracker / trackPageView).
 */
export function initAnalytics(): void {
  if (initialized) return
  if (!MEASUREMENT_ID) return
  if (!isBrowser()) return

  initialized = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    ...(DEBUG_MODE ? { debug_mode: true } : {}),
  })
}

function canTrack(): boolean {
  return isBrowser() && initialized && typeof window.gtag === 'function'
}

/** Query-string keys safe to carry into analytics page paths. Anything
 * else (e.g. a free-text search box synced to the URL in the future) is
 * dropped rather than risk sending arbitrary visitor-entered text. */
const SAFE_QUERY_KEYS = ['gem', 'type']

/**
 * Builds the logical page path tracked in GA4 for a given HashRouter
 * location, e.g. "/#/gem/12" or "/#/gems?type=Ruby". Mirrors the actual
 * address-bar hash rather than the static path GitHub Pages serves ("/"
 * for every route), and only forwards an allow-listed set of query
 * params — both public catalog identifiers, never free text.
 */
export function buildTrackedPath(pathname: string, search: string): string {
  const params = new URLSearchParams(search)
  const safeParams = new URLSearchParams()
  for (const key of SAFE_QUERY_KEYS) {
    const value = params.get(key)
    if (value) safeParams.set(key, value)
  }
  const query = safeParams.toString()
  return `/#${pathname}${query ? `?${query}` : ''}`
}

// Dedupes consecutive identical page views (e.g. React StrictMode's
// double effect-firing in dev) without needing per-component state.
let lastTrackedPath: string | null = null

/**
 * Tracks a page view. Call on every logical route change — see
 * AnalyticsRouteTracker, which builds `path` via buildTrackedPath().
 *
 * `page_location` is built from `path` (already scrubbed to the
 * SAFE_QUERY_KEYS allowlist) rather than the literal `window.location.href`
 * — a hash-route URL could otherwise carry an arbitrary query param
 * straight into GA before it's ever inspected here.
 */
export function trackPageView(path: string, title?: string): void {
  if (!canTrack()) return
  if (path === lastTrackedPath) return
  lastTrackedPath = path

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: title ?? document.title,
  })
}

/**
 * Tracks a GA4 event. The single call site every component should use
 * instead of reaching for `window.gtag` directly.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!canTrack()) return
  window.gtag('event', eventName, params ?? {})
}

// Last dedupeValue seen per dedupeKey, for trackEventOnce below.
const lastFiredValue = new Map<string, string>()

/**
 * Like trackEvent, but skips firing if the previous call under the same
 * `dedupeKey` already fired for this same `dedupeValue`.
 *
 * Meant for effect-driven tracking (fire once when a product page has
 * "loaded", not on every re-render) — a plain `useRef` guard inside the
 * component doesn't actually work there: React StrictMode's dev-only
 * double effect invocation unmounts and remounts the component to test
 * for cleanup bugs, which resets refs and would still double-fire.
 * A module-level map survives that. Discrete user actions (a click, a
 * form submit) aren't subject to this and should just call trackEvent.
 */
export function trackEventOnce(
  dedupeKey: string,
  dedupeValue: string,
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (lastFiredValue.get(dedupeKey) === dedupeValue) return
  lastFiredValue.set(dedupeKey, dedupeValue)
  trackEvent(eventName, params)
}
