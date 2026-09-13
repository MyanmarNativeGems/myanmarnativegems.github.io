import { useState } from 'react'
import { cn } from '../../lib/utils'
import { GemImage } from './GemImage'

/**
 * Detail-page photo viewer: one large photo plus thumbnails when the
 * stone has more than one image.
 */
export function GemGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <GemImage
        src={images[activeIndex]}
        alt={alt}
        loading="eager"
        className="w-full"
      />
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                'w-20 border transition-colors duration-200',
                index === activeIndex
                  ? 'border-ink'
                  : 'border-line hover:border-ink-soft',
              )}
            >
              <GemImage src={image} alt="" className="w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
