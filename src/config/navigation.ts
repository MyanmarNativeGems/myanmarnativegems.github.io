import { gemstoneCategories } from './gemstones'

export interface NavLinkItem {
  to: string
  /** i18next key resolving to the translated link label. */
  labelKey: string
}

// "Learn" and "Our Story" were dropped from the primary nav to make room
// for the growing list of gemstone categories; both stay reachable from
// the footer (see Footer.tsx).
//
// Uses each category's `shortName` (not `name`) — the primary nav is a
// single tight row, and `name` carries a "(Ruby)"-style English gloss
// that's worth showing on a category's own heading but too wide to repeat
// across seven nav items without wrapping.
export const navLinks: NavLinkItem[] = [
  { to: '/gems', labelKey: 'nav.gemstones' },
  ...gemstoneCategories.map((category) => ({
    to: `/${category.slug}`,
    labelKey: `gemstones.${category.slug}.shortName`,
  })),
]
