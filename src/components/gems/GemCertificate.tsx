import { useId, useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import { toDirectImageUrl } from '../../lib/googleSheets'
import { cn } from '../../lib/utils'

/**
 * Collapsed by default: a "View certificate" toggle keeps the detail page
 * uncluttered, and expands in place to the report image (no new tab needed
 * to confirm a stone is certified). Drive links that can't render as an
 * image (some PDFs, a revoked share) fall back to a plain external link,
 * the same graceful degradation GemImage uses for stone photos.
 */
export function GemCertificate({
  url,
  alt,
  className,
}: {
  url: string
  alt: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const panelId = useId()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-2 text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
      >
        <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        {open ? 'Hide certificate' : 'View certificate'}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180',
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} className="mt-4">
          {failed ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
            >
              Open certificate in a new tab
            </a>
          ) : (
            <>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the full laboratory certificate in a new tab"
                className={cn(
                  'block border border-line bg-ivory-deep p-3',
                  'transition-colors duration-200 hover:border-ink-soft',
                )}
              >
                <img
                  src={toDirectImageUrl(url)}
                  alt={`Laboratory certificate for ${alt}`}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setFailed(true)}
                  className="mx-auto h-auto max-h-[30rem] w-auto max-w-full object-contain"
                />
              </a>
              <p className="mt-2 text-xs text-ink-soft">Tap to view full size.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
