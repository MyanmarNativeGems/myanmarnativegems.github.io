import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'ruby' | 'outline'

const baseClasses =
  'inline-flex h-12 items-center justify-center whitespace-nowrap px-8 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 active:translate-y-px motion-reduce:transition-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-ivory hover:bg-ruby',
  ruby: 'bg-ruby text-ivory hover:bg-ruby-deep',
  outline: 'border border-ink text-ink hover:border-ruby hover:text-ruby',
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Internal route; renders a react-router Link. */
  to?: string
  /** External or mailto URL; renders an anchor. */
  href?: string
  variant?: ButtonVariant
  children: ReactNode
  /**
   * Takes no event argument on purpose: this fires identically whether
   * the button renders as a <button>, a router <Link>, or a plain <a>,
   * which a MouseEvent<HTMLButtonElement> couldn't type-check across all
   * three. Callers that only need "this was clicked" (e.g. analytics)
   * don't lose anything; every current call site already ignores the event.
   */
  onClick?: () => void
}

export function Button({
  to,
  href,
  variant = 'primary',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className)

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
