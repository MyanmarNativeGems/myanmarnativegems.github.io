import { useParams } from 'react-router'
import { MarkdownPage } from '../components/content/MarkdownPage'
import { InquiryCTA } from '../components/home/InquiryCTA'
import { getContent } from '../lib/markdown'
import type { ContentCollection } from '../types/content'
import { NotFoundPage } from './NotFoundPage'

/**
 * Renders one Markdown document as a full editorial page.
 * Used for /about (fixed slug) and /education/:slug (route param).
 */
export function ContentPage({
  collection,
  slug,
}: {
  collection: ContentCollection
  slug?: string
}) {
  const params = useParams()
  const resolvedSlug = slug ?? params.slug
  const document = resolvedSlug
    ? getContent(collection, resolvedSlug)
    : undefined

  if (!document) return <NotFoundPage />

  return (
    <>
      <MarkdownPage document={document} />
      <InquiryCTA />
    </>
  )
}
