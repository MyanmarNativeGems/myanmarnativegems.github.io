/**
 * The four gemstone categories with dedicated landing pages.
 * Collection filters are derived from live Sheet data, not from this list;
 * this list only drives the landing routes, homepage tiles, and navigation.
 */
export interface GemstoneCategory {
  /** Route segment, e.g. /ruby */
  slug: string
  name: string
  /** Case-insensitive substring used to match Sheet "Gem Type" values. */
  keyword: string
  /** Education guide slug for this gemstone. */
  guideSlug: string
  /** Placeholder tile art until real photography is available. */
  image: string
}

export const gemstoneCategories: GemstoneCategory[] = [
  {
    slug: 'ruby',
    name: 'Ruby',
    keyword: 'ruby',
    guideSlug: 'ruby',
    image: '/images/gems/ruby.svg',
  },
  {
    slug: 'sapphire',
    name: 'Sapphire',
    keyword: 'sapphire',
    guideSlug: 'sapphire',
    image: '/images/gems/sapphire.svg',
  },
  {
    slug: 'jade',
    name: 'Jade',
    keyword: 'jade',
    guideSlug: 'jade',
    image: '/images/gems/jade.svg',
  },
  {
    slug: 'spinel',
    name: 'Spinel',
    keyword: 'spinel',
    guideSlug: 'spinel',
    image: '/images/gems/spinel.svg',
  },
]
