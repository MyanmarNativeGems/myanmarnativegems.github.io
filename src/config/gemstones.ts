/**
 * The gemstone categories with dedicated landing pages.
 * Collection filters are derived from live Sheet data, not from this list;
 * this list only drives the landing routes, homepage tiles, and navigation.
 */
export interface GemstoneCategory {
  /** Route segment, e.g. /ruby */
  slug: string
  name: string
  /**
   * Case-insensitive substring used to match Sheet "Gem Type" values.
   * Omitted only for the catch-all "Others" category, which matches any
   * stone that doesn't match one of the named keywords below.
   */
  keyword?: string
  /** Education guide slug for this gemstone. */
  guideSlug: string
  /** Tile / landing image. */
  image: string
}

export const gemstoneCategories: GemstoneCategory[] = [
  {
    slug: 'ruby',
    name: 'Ruby',
    keyword: 'ruby',
    guideSlug: 'ruby',
    image: '/images/gems/ruby.png',
  },
  {
    slug: 'sapphire',
    name: 'Sapphire',
    keyword: 'sapphire',
    guideSlug: 'sapphire',
    image: '/images/gems/sapphire.png',
  },
  {
    slug: 'peridot',
    name: 'Peridot',
    keyword: 'peridot',
    guideSlug: 'peridot',
    image: '/images/gems/peridot.png',
  },
  {
    slug: 'tourmaline',
    name: 'Tourmaline',
    keyword: 'tourmaline',
    guideSlug: 'tourmaline',
    image: '/images/gems/tourmaline.png',
  },
  {
    slug: 'spinel',
    name: 'Spinel',
    keyword: 'spinel',
    guideSlug: 'spinel',
    image: '/images/gems/spinel.png',
  },
  {
    slug: 'zircon',
    name: 'Zircon',
    keyword: 'zircon',
    guideSlug: 'zircon',
    image: '/images/gems/zircon.png',
  },
  {
    slug: 'other',
    name: 'Others',
    // No keyword: catches every stone that isn't one of the named types.
    guideSlug: 'other',
    image: '/images/gems/other.png',
  },
]
