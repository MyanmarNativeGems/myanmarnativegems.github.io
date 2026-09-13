import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, Search, X } from 'lucide-react'
import { Container } from '../common/Container'
import { navLinks } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { cn } from '../../lib/utils'
import { MobileNavigation } from './MobileNavigation'

export function Header() {
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
      <Container className="flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link
          to="/"
          className="font-serif text-lg font-semibold uppercase tracking-[0.22em] md:text-xl"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm transition-colors duration-200',
                  isActive
                    ? 'text-ink underline decoration-gold decoration-1 underline-offset-8'
                    : 'text-ink-soft hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="inline-flex h-9 items-center border border-ink px-5 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 hover:border-ruby hover:text-ruby"
          >
            Inquire
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Link
            to="/gems"
            aria-label="Search the collection"
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
