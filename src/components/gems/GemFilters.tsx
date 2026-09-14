import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '../../lib/analytics'
import { cn, type GemFilterState, type GemSort } from '../../lib/utils'
import { translateGemType } from '../../i18n/gemTypes'
import type { Locale } from '../../i18n'

/** How long the search box must sit idle before it's treated as "committed". */
const SEARCH_TRACK_DEBOUNCE_MS = 500

const SORT_OPTIONS: Array<{ value: GemSort; labelKey: string }> = [
  { value: 'no', labelKey: 'filters.sort.no' },
  { value: 'carat-asc', labelKey: 'filters.sort.caratAsc' },
  { value: 'carat-desc', labelKey: 'filters.sort.caratDesc' },
  { value: 'price-asc', labelKey: 'filters.sort.priceAsc' },
  { value: 'price-desc', labelKey: 'filters.sort.priceDesc' },
]

interface GemFiltersProps {
  /** Gem types derived from the live inventory. */
  gemTypes: string[]
  value: GemFilterState
  onChange: (value: GemFilterState) => void
  className?: string
}

export function GemFilters({
  gemTypes,
  value,
  onChange,
  className,
}: GemFiltersProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const typeOptions = ['all', ...gemTypes]

  // Fires GA4 "search" once the box has been idle for a moment, so it
  // reflects a committed search term rather than every keystroke. Only
  // non-empty terms count as a search; clearing the box (e.g. via
  // "Clear Filters") isn't one.
  useEffect(() => {
    const query = value.search.trim()
    if (!query) return
    const timeout = setTimeout(() => {
      trackEvent('search', { search_term: query })
    }, SEARCH_TRACK_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [value.search])

  return (
    <div className={className}>
      <div
        role="group"
        aria-label={t('filters.groupLabel')}
        className="flex flex-wrap gap-x-6 gap-y-2"
      >
        {typeOptions.map((type) => {
          const active = value.type === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                // Only an actual change is "the visitor changed a
                // filter" — re-clicking the already-active option isn't.
                if (type !== value.type) {
                  trackEvent('filter_collection', {
                    filter_type: 'gemstone',
                    filter_value: type,
                  })
                }
                onChange({ ...value, type })
              }}
              aria-pressed={active}
              className={cn(
                'border-b pb-1 text-sm transition-colors duration-200',
                active
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-soft hover:text-ink',
              )}
            >
              {type === 'all' ? t('filters.all') : translateGemType(type, locale)}
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="relative w-full max-w-xs">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            strokeWidth={1.5}
            aria-hidden
          />
          <label htmlFor="gem-search" className="sr-only">
            {t('filters.searchLabel')}
          </label>
          <input
            id="gem-search"
            type="search"
            value={value.search}
            onChange={(event) =>
              onChange({ ...value, search: event.target.value })
            }
            placeholder={t('filters.searchPlaceholder')}
            className="w-full border-b border-line bg-transparent py-2 pl-7 text-sm placeholder:text-ink-soft/70 focus:border-ink focus:outline-none"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={value.availableOnly}
            onChange={(event) =>
              onChange({ ...value, availableOnly: event.target.checked })
            }
            className="h-4 w-4 accent-ruby"
          />
          {t('filters.availableOnly')}
        </label>

        <label className="flex items-center gap-2.5 text-sm">
          <span className="text-ink-soft">{t('filters.sortLabel')}</span>
          <select
            value={value.sort}
            onChange={(event) =>
              onChange({ ...value, sort: event.target.value as GemSort })
            }
            className="border-b border-line bg-transparent py-2 text-sm focus:border-ink focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
