import type { Locale } from './index'

/**
 * Localized names for gem types that have a well-established,
 * unambiguous trade term in a given language. Burmese only has solid,
 * unambiguous terms for ruby and sapphire, so the rest are intentionally
 * left in English rather than guessing at a translation; Chinese has
 * conventional gemological terms for all of these, so all are translated.
 * See gemstones.* in the locale files for the same per-language choice
 * applied to the site's own category pages.
 */
const GEM_TYPE_NAMES: Partial<Record<Locale, Array<[keyword: string, name: string]>>> = {
  my: [
    ['ruby', 'ပတ္တမြား'],
    ['sapphire', 'နီလာ'],
  ],
  zh: [
    ['ruby', '紅寶石'],
    ['sapphire', '藍寶石'],
    ['peridot', '橄欖石'],
    ['tourmaline', '碧璽'],
    ['spinel', '尖晶石'],
    ['zircon', '鋯石'],
  ],
}

/**
 * Live inventory gem-type strings come from the Google Sheet as free
 * English text (e.g. "Ruby", "Pink Sapphire"). In a non-English locale
 * with a known name for that type, prefix it and keep the original
 * English in parentheses so the internationally-recognized term stays
 * visible; unrecognized types (or English mode) are shown unchanged
 * rather than mistranslated.
 */
export function translateGemType(gemType: string, locale: Locale): string {
  const names = GEM_TYPE_NAMES[locale]
  if (!names) return gemType
  const lower = gemType.toLowerCase()
  const match = names.find(([keyword]) => lower.includes(keyword))
  return match ? `${match[1]} (${gemType})` : gemType
}
