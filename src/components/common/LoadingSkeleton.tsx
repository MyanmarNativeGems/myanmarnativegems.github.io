import { useTranslation } from 'react-i18next'
import { cn, gemGridClass, type GemGridVariant } from '../../lib/utils'

export function GemCardSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-hidden>
      <div className="aspect-square bg-ivory-deep" />
      <div className="mt-4 h-4 w-2/5 bg-ivory-deep" />
      <div className="mt-2 h-3 w-1/4 bg-ivory-deep" />
      <div className="mt-2 h-3 w-1/3 bg-ivory-deep" />
    </div>
  )
}

export function GemGridSkeleton({
  count = 8,
  variant = 'catalog',
  className,
}: {
  count?: number
  variant?: GemGridVariant
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(gemGridClass[variant], className)}
      role="status"
      aria-label={t('loading.gemstonesAria')}
    >
      {Array.from({ length: count }, (_, index) => (
        <GemCardSkeleton key={index} />
      ))}
    </div>
  )
}
