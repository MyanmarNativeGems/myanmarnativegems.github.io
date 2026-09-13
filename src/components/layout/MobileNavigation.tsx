import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { Container } from '../common/Container'
import { cn } from '../../lib/utils'
import { navLinks } from '../../config/navigation'

export function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
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
      aria-label="Primary"
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
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/contact" className="py-3.5 text-base text-ink">
          Inquire
        </NavLink>
      </Container>
    </nav>
  )
}
