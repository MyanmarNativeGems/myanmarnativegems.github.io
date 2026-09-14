import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MarkdownPage } from '../components/content/MarkdownPage'
import { InquiryCTA } from '../components/home/InquiryCTA'
import { usePageMeta } from '../hooks/usePageMeta'
import { getContent } from '../lib/markdown'
import type { ContentCollection } from '../types/content'
import type { Locale } from '../i18n'
import { NotFoundPage } from './NotFoundPage'

/**
 * Renders one Markdown document as a full editorial page.
 * Used for /about (fixed slug) and /education/:slug (route param).
 *
 * `metaTitle` overrides the page-meta `<title>` for routes where the SEO
 * title differs from the on-page heading (e.g. /about's tab title is
 * "About", but the heading is the more editorial "Our Story").
 */
export function ContentPage({
  collection,
  slug,
  metaTitle,
}: {
  collection: ContentCollection
  slug?: string
  metaTitle?: string
}) {
  const { i18n } = useTranslation()
  const params = useParams()
  const resolvedSlug = slug ?? params.slug
  const document = resolvedSlug
    ? getContent(collection, resolvedSlug, i18n.language as Locale)
    : undefined

  usePageMeta(
    metaTitle ?? document?.frontmatter.title ?? '',
    document?.frontmatter.description,
  )

  if (!document) return <NotFoundPage />

  return (
    <>
      <MarkdownPage document={document} />
      <InquiryCTA />
    </>
  )
}
