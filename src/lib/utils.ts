import { gemstoneCategories } from '../config/gemstones'
import type { Gem } from '../types/gem'

/** Joins conditional class names. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Matches a free-text gem type (e.g. "Pink Sapphire") to one of the
 * site's own category slugs, the same substring rule GemstonePage uses
 * to build each category's listing. Used for analytics (view_item's
 * item_category), where a stable slug is more useful than free text.
 */
export function matchGemstoneCategorySlug(gemType: string): string {
  const lower = gemType.toLowerCase()
  const match = gemstoneCategories.find(
    (category) => category.keyword && lower.includes(category.keyword),
  )
  return match?.slug ?? 'other'
}

const caratFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

/** Formats a carat weight for display, e.g. 1.25 -> "1.25 ct". */
export function formatCarat(carat: number): string {
  return `${caratFormatter.format(carat)} ct`
}

/** Numeric-aware ordering by gem number ("2" before "10"). */
export function compareGemNo(a: Gem, b: Gem): number {
  return a.no.localeCompare(b.no, 'en', { numeric: true, sensitivity: 'base' })
}

/**
 * Featured selection for the homepage.
 * The Sheet has no Featured column yet, so the interim rule is:
 * available stones, ordered by gem number, first `count`.
 * When a Featured column is added, only this function needs to change.
 */
export function selectFeaturedGems(gems: Gem[], count = 4): Gem[] {
  return gems.filter((gem) => !gem.isSold).sort(compareGemNo).slice(0, count)
}

/**
 * Descriptive alt text for a gem image.
 * `typeLabel` and `stoneNoText` are pre-translated by the caller (gem
 * type names and the "Stone No." phrasing are locale-dependent; utils.ts
 * stays free of i18n dependencies).
 */
export function gemAltText(
  gem: Gem,
  typeLabel: string,
  stoneNoText: string,
): string {
  const carat = gem.carat !== undefined ? `, ${formatCarat(gem.carat)}` : ''
  return `${typeLabel}${carat}, ${stoneNoText}`
}

export type GemSort =
  | 'no'
  | 'carat-asc'
  | 'carat-desc'
  | 'price-asc'
  | 'price-desc'

export interface GemFilterState {
  /** 'all' or an exact gem type from the live data. */
  type: string
  availableOnly: boolean
  search: string
  sort: GemSort
}

/** Unique gem types present in the data, for building filter options. */
export function deriveGemTypes(gems: Gem[]): string[] {
  return [...new Set(gems.map((gem) => gem.gemType))].sort((a, b) =>
    a.localeCompare(b),
  )
}

function compareOptionalNumber(
  a: number | undefined,
  b: number | undefined,
  direction: 1 | -1,
): number {
  // Stones without a value sort last regardless of direction.
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  return (a - b) * direction
}

export function filterAndSortGems(
  gems: Gem[],
  state: GemFilterState,
): Gem[] {
  const query = state.search.trim().toLowerCase()

  const filtered = gems.filter((gem) => {
    if (state.type !== 'all' && gem.gemType !== state.type) return false
    if (state.availableOnly && gem.isSold) return false
    if (
      query &&
      !gem.gemType.toLowerCase().includes(query) &&
      !gem.no.toLowerCase().includes(query)
    ) {
      return false
    }
    return true
  })

  switch (state.sort) {
    case 'carat-asc':
      return filtered.sort((a, b) => compareOptionalNumber(a.carat, b.carat, 1))
    case 'carat-desc':
      return filtered.sort((a, b) =>
        compareOptionalNumber(a.carat, b.carat, -1),
      )
    case 'price-asc':
      return filtered.sort((a, b) =>
        compareOptionalNumber(a.priceKyat, b.priceKyat, 1),
      )
    case 'price-desc':
      return filtered.sort((a, b) =>
        compareOptionalNumber(a.priceKyat, b.priceKyat, -1),
      )
    default:
      return filtered.sort(compareGemNo)
  }
}

/** Shared responsive grid classes for gem cards and their skeletons. */
export const gemGridClass = {
  /** Collection browsing: 2 / 3 / 4 columns. */
  catalog:
    'grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-14 xl:grid-cols-4',
  /** Exactly four highlights: 2x2 on small screens, one row on large. */
  quad: 'grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-8 lg:grid-cols-4',
} as const

export type GemGridVariant = keyof typeof gemGridClass
