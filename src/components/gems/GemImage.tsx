import { useState } from 'react'
import { Gem as GemIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface GemImageProps {
  src?: string
  /** Optional second photo, revealed on hover when the pointer supports it. */
  hoverSrc?: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Consistent-ratio gem photograph with lazy loading, a quiet placeholder
 * when no image exists, and graceful fallback when an image fails to load.
 * Parents that want the hover zoom / second-photo reveal add `group`.
 */
export function GemImage({
  src,
  hoverSrc,
  alt,
  className,
  loading = 'lazy',
}: GemImageProps) {
  const [primaryFailed, setPrimaryFailed] = useState(false)
  const [hoverFailed, setHoverFailed] = useState(false)

  const showPlaceholder = !src || primaryFailed

  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden bg-ivory-deep',
        className,
      )}
    >
      {showPlaceholder ? (
        <div
          className="flex h-full w-full items-center justify-center"
          role="img"
          aria-label={alt}
        >
          <GemIcon
            className="h-8 w-8 text-ink-soft/50"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onError={() => setPrimaryFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {hoverSrc && !hoverFailed && (
            <img
              src={hoverSrc}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              onError={() => setHoverFailed(true)}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </>
      )}
    </div>
  )
}
