/**
 * The gemstone categories with dedicated landing pages.
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
  /** Tile / landing image. Sapphire and zircon use placeholder art until a photo exists. */
  image: string
}

export const gemstoneCategories: GemstoneCategory[] = [
  {
    slug: 'ruby',
    name: 'Ruby',
    keyword: 'ruby',
    guideSlug: 'ruby',
    image: '/images/gems/ruby.jpg',
  },
  {
    slug: 'sapphire',
    name: 'Sapphire',
    keyword: 'sapphire',
    guideSlug: 'sapphire',
    image: '/images/gems/sapphire.svg',
  },
  {
    slug: 'spinel',
    name: 'Spinel',
    keyword: 'spinel',
    guideSlug: 'spinel',
    image: '/images/gems/spinel.jpg',
  },
  {
    slug: 'zircon',
    name: 'Zircon',
    keyword: 'zircon',
    guideSlug: 'zircon',
    image: '/images/gems/zircon.svg',
  },
]
