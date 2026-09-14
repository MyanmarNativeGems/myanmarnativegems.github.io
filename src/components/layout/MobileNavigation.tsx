import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { cn } from '../../lib/utils'
import { navLinks } from '../../config/navigation'
import { LanguageToggle } from './LanguageToggle'

export function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <nav
      id="mobile-navigation"
      aria-label={t('a11y.primaryNav')}
      className="border-t border-line bg-ivory lg:hidden"
    >
      <Container className="flex flex-col py-4">
        {navLinks.map((link, index) => (
          <NavLink
            key={link.to}
            to={link.to}
            ref={index === 0 ? firstLinkRef : undefined}
            className={({ isActive }) =>
              cn(
                'border-b border-line py-3.5 text-base',
                isActive ? 'text-ink' : 'text-ink-soft',
              )
            }
          >
            {t(link.labelKey)}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className="border-b border-line py-3.5 text-base text-ink"
        >
          {t('nav.inquire')}
        </NavLink>
        <LanguageToggle className="pt-4" />
      </Container>
    </nav>
  )
}
