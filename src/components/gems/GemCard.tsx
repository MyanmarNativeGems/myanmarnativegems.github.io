import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Gem } from '../../types/gem'
import { formatKyat } from '../../lib/currency'
import { cn, formatCarat, gemAltText } from '../../lib/utils'
import { translateGemType } from '../../i18n/gemTypes'
import type { Locale } from '../../i18n'
import { GemImage } from './GemImage'

export function GemCard({ gem }: { gem: Gem }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const typeLabel = translateGemType(gem.gemType, locale)

  return (
    <Link to={`/gem/${gem.no}`} className="group block">
      <GemImage
        src={gem.images[0]}
        hoverSrc={gem.images[1]}
        alt={gemAltText(gem, typeLabel, t('gem.stoneNoPrefix', { no: gem.no }))}
        className={cn(gem.isSold && 'opacity-75 saturate-50')}
      />
      <div className="mt-4">
        <h3 className="font-serif text-xl font-medium leading-snug underline-offset-4 transition-colors duration-200 group-hover:underline group-hover:decoration-gold group-hover:decoration-1">
          {typeLabel}
        </h3>
        {gem.carat !== undefined && (
          <p className="mt-1 text-sm text-ink-soft">{formatCarat(gem.carat)}</p>
        )}
        <p className="mt-1 text-sm">
          {gem.isSold ? (
            <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              {t('gem.sold')}
            </span>
          ) : gem.priceKyat !== undefined ? (
            formatKyat(gem.priceKyat)
          ) : (
            <span className="text-ink-soft">{t('gem.priceOnRequest')}</span>
          )}
        </p>
      </div>
    </Link>
  )
}
