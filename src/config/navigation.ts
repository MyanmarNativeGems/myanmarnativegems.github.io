import { gemstoneCategories } from './gemstones'

export interface NavLinkItem {
  to: string
  label: string
}

// "Learn" and "Our Story" were dropped from the primary nav to make room
// for the growing list of gemstone categories; both stay reachable from
// the footer (see Footer.tsx).
export const navLinks: NavLinkItem[] = [
  { to: '/gems', label: 'Gemstones' },
  ...gemstoneCategories.map((category) => ({
    to: `/${category.slug}`,
    label: category.name,
  })),
]
