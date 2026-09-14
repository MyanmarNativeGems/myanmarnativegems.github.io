import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'
import type { Locale } from '../../i18n'

/**
 * The flag + short code here are intentionally never translated (see the
 * i18n task spec): a language switcher should stay legible to a visitor
 * who doesn't yet read the language they're about to switch away from.
 * `label` is the full name, used for the accessible name and menu text;
 * `code` is the compact form shown on the collapsed trigger.
 */
const LANGUAGES: Array<{
  code: Locale
  flag: string
  short: string
  label: string
}> = [
  { code: 'en', flag: '🇺🇸', short: 'ENG', label: 'English' },
  { code: 'my', flag: '🇲🇲', short: 'MYR', label: 'Myanmar' },
  // Traditional Chinese content (see zh.json) — flagged as Taiwan rather
  // than 🇨🇳, which is conventionally associated with Simplified Chinese.
  { code: 'zh', flag: '🇹🇼', short: 'ZH', label: 'Chinese' },
]

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const current: Locale =
    LANGUAGES.find((language) => language.code === i18n.language)?.code ?? 'en'
  const currentLanguage =
    LANGUAGES.find((language) => language.code === current) ?? LANGUAGES[0]

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('a11y.languageSwitcher')}
        className="flex h-9 items-center gap-1.5 border border-line px-3 text-xs uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:border-ink"
      >
        <span aria-hidden="true">{currentLanguage.flag}</span>
        <span>{currentLanguage.short}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-label={t('a11y.languageSwitcher')}
          className="absolute right-0 z-50 mt-1 w-32 border border-line bg-ivory py-1 shadow-sm"
        >
          {LANGUAGES.map((language) => {
            const active = language.code === current
            return (
              <li key={language.code} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  aria-current={active ? 'true' : undefined}
                  aria-label={t('a11y.switchLanguage', {
                    language: language.label,
                  })}
                  onClick={() => {
                    void i18n.changeLanguage(language.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-xs uppercase tracking-[0.1em] transition-colors duration-200',
                    active
                      ? 'text-ink underline decoration-gold decoration-1 underline-offset-4'
                      : 'text-ink-soft hover:text-ink',
                  )}
                >
                  <span aria-hidden="true">{language.flag}</span>
                  <span>{language.short}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
