/**
 * Non-translatable site identity. `tagline` and `description` are kept
 * here as the canonical English source, but the strings actually shown to
 * visitors live in src/i18n/locales/{en,my}.json under `site.tagline` /
 * `site.description` (see Hero.tsx and Footer.tsx) so they can be
 * translated; `name`, `url`, and `email` must never be translated and are
 * used directly wherever the brand appears.
 */
export const siteConfig = {
  name: 'Myanmar Native Gems',
  tagline: 'Rare by Nature.',
  description:
    'A curated collection of natural, untreated cut gemstones from Mogok, Myanmar.',
  url: 'https://myanmarnativegems.github.io',
  email: 'myanmarnativegems2024@gmail.com',
  // TODO: set the Instagram profile URL when available (leave empty to hide).
  instagram: '',
} as const

/**
 * Store-wide provenance, stated by the owner: every stone in the collection
 * is mined in Mogok, Myanmar, and is 100% natural with no heat or other
 * treatments. The English values here are canonical; the localized strings
 * shown on the gem detail page live under `provenance.*` in the i18n
 * locale files.
 */
export const provenance = {
  origin: 'Mogok, Myanmar',
  treatment: 'None (natural, unheated)',
  originUrl: 'https://wikitravel.org/en/Moegoke',
} as const
