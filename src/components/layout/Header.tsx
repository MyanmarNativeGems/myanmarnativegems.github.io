import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { navLinks } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { cn } from '../../lib/utils'
import { LanguageToggle } from './LanguageToggle'
import { MobileNavigation } from './MobileNavigation'

export function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the drawer whenever navigation happens (state adjustment during
  // render instead of an effect, per react-hooks/set-state-in-effect).
  const [prevPathname, setPrevPathname] = useState(location.pathname)
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory">
      {/*
        min-h (not a fixed h-16/h-[72px]) plus flex-wrap: Burmese nav
        labels run noticeably longer than their English source ("Gemstones"
        -> "ကျောက်မျက်ရတနာများ"), so the row can need a second line at
        narrower desktop widths. A fixed-height row would clip or overlap
        the content below it when that happens; min-height lets the header
        grow instead.
      */}
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 md:min-h-[72px]">
        <Link
          to="/"
          className="shrink-0 whitespace-nowrap font-serif text-lg font-semibold uppercase tracking-[0.22em] md:text-xl"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label={t('a11y.primaryNav')}
          className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 lg:flex"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap text-sm transition-colors duration-200',
                  isActive
                    ? 'text-ink underline decoration-gold decoration-1 underline-offset-8'
                    : 'text-ink-soft hover:text-ink',
                )
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
          <LanguageToggle className="shrink-0" />
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to="/gems"
            aria-label={t('a11y.searchCollection')}
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={t(menuOpen ? 'a11y.closeMenu' : 'a11y.openMenu')}
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </Container>

      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
