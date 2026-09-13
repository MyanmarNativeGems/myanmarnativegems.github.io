import { gemstoneCategories } from './gemstones'

export interface NavLinkItem {
  to: string
  label: string
}

export const navLinks: NavLinkItem[] = [
  { to: '/gems', label: 'Gemstones' },
  ...gemstoneCategories.map((category) => ({
    to: `/${category.slug}`,
    label: category.name,
  })),
  { to: '/education', label: 'Learn' },
  { to: '/about', label: 'Our Story' },
]
