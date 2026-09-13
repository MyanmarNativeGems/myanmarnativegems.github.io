export const siteConfig = {
  name: 'Myanmar Native Gems',
  tagline: 'Rare by Nature.',
  description:
    'A curated collection of natural, untreated cut gemstones from Mogok, Myanmar.',
  url: 'https://burmagems.github.io',
  email: 'myanmarnativegems2024@gmail.com',
  // TODO: set the Instagram profile URL when available (leave empty to hide).
  instagram: '',
} as const

/**
 * Store-wide provenance, stated by the owner: every stone in the collection
 * is mined in Mogok, Myanmar, and is 100% natural with no heat or other
 * treatments. Shown on every gem detail page.
 */
export const provenance = {
  origin: 'Mogok, Myanmar',
  treatment: 'None (natural, unheated)',
  originUrl: 'https://wikitravel.org/en/Moegoke',
} as const
