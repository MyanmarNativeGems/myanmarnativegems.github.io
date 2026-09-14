import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'
import { Button } from './Button'

export function ErrorState({
  onRetry,
  className,
}: {
  onRetry?: () => void
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'border border-line bg-ivory-deep px-6 py-14 text-center',
        className,
      )}
      role="alert"
    >
      <p className="font-serif text-2xl font-medium">{t('errorState.title')}</p>
      <p className="mt-2 text-ink-soft">{t('errorState.subtitle')}</p>
      {onRetry && (
        <Button variant="outline" className="mt-7" onClick={onRetry}>
          {t('errorState.retry')}
        </Button>
      )}
    </div>
  )
}
