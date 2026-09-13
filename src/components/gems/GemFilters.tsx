import { Search } from 'lucide-react'
import { cn, type GemFilterState, type GemSort } from '../../lib/utils'

const SORT_OPTIONS: Array<{ value: GemSort; label: string }> = [
  { value: 'no', label: 'Gem No.' },
  { value: 'carat-asc', label: 'Carat: Low to High' },
  { value: 'carat-desc', label: 'Carat: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
  const typeOptions = ['all', ...gemTypes]

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filter by gem type"
        className="flex flex-wrap gap-x-6 gap-y-2"
      >
        {typeOptions.map((type) => {
          const active = value.type === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...value, type })}
              aria-pressed={active}
              className={cn(
                'border-b pb-1 text-sm transition-colors duration-200',
                active
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-soft hover:text-ink',
              )}
            >
              {type === 'all' ? 'All' : type}
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
            Search by gem type or number
          </label>
          <input
            id="gem-search"
            type="search"
            value={value.search}
            onChange={(event) =>
              onChange({ ...value, search: event.target.value })
            }
            placeholder="Search type or number"
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
          Available only
        </label>

        <label className="flex items-center gap-2.5 text-sm">
          <span className="text-ink-soft">Sort</span>
          <select
            value={value.sort}
            onChange={(event) =>
              onChange({ ...value, sort: event.target.value as GemSort })
            }
            className="border-b border-line bg-transparent py-2 text-sm focus:border-ink focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
