import { useEffect } from 'react'
import { siteConfig } from '../config/site'

/**
 * Sets the document title and meta description for the current route.
 * `title` should already be translated by the caller; the brand name is
 * appended here (never translated) so every page ends in
 * "... | Myanmar Native Gems" regardless of language.
 *
 * Pass an empty `title` to skip the update entirely — used by ContentPage,
 * which renders <NotFoundPage /> (and lets it set its own meta) when a
 * document isn't found, rather than overwriting that with a blank title.
 */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    if (!title) return
    document.title = `${title} | ${siteConfig.name}`

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      )
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
