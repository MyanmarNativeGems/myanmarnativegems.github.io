import { Link } from 'react-router'
import type { Gem } from '../../types/gem'
import { formatKyat } from '../../lib/currency'
import { cn, formatCarat, gemAltText } from '../../lib/utils'
import { GemImage } from './GemImage'

export function GemCard({ gem }: { gem: Gem }) {
  return (
    <Link to={`/gem/${gem.no}`} className="group block">
      <GemImage
        src={gem.images[0]}
        hoverSrc={gem.images[1]}
        alt={gemAltText(gem)}
        className={cn(gem.isSold && 'opacity-75 saturate-50')}
      />
      <div className="mt-4">
        <h3 className="font-serif text-xl font-medium leading-snug underline-offset-4 transition-colors duration-200 group-hover:underline group-hover:decoration-gold group-hover:decoration-1">
          {gem.gemType}
        </h3>
        {gem.carat !== undefined && (
          <p className="mt-1 text-sm text-ink-soft">{formatCarat(gem.carat)}</p>
        )}
        <p className="mt-1 text-sm">
          {gem.isSold ? (
            <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              Sold
            </span>
          ) : gem.priceKyat !== undefined ? (
            formatKyat(gem.priceKyat)
          ) : (
            <span className="text-ink-soft">Price on request</span>
          )}
        </p>
      </div>
    </Link>
  )
}
