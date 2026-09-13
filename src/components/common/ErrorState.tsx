import { cn } from '../../lib/utils'
import { Button } from './Button'

export function ErrorState({
  onRetry,
  className,
}: {
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'border border-line bg-ivory-deep px-6 py-14 text-center',
        className,
      )}
      role="alert"
    >
      <p className="font-serif text-2xl font-medium">
        We're unable to load the gemstone collection right now.
      </p>
      <p className="mt-2 text-ink-soft">Please try again shortly.</p>
      {onRetry && (
        <Button variant="outline" className="mt-7" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
