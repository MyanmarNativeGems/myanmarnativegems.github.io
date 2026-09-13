import { Link } from 'react-router'
import type { ContentDocument } from '../../types/content'

/** Quiet text row linking to an education article. */
export function ArticleCard({ document }: { document: ContentDocument }) {
  return (
    <Link
      to={`/education/${document.slug}`}
      className="group block border-t border-line py-6"
    >
      <h3 className="font-serif text-xl font-medium underline-offset-4 transition-colors duration-200 group-hover:underline group-hover:decoration-gold group-hover:decoration-1">
        {document.frontmatter.title}
      </h3>
      {document.frontmatter.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {document.frontmatter.description}
        </p>
      )}
    </Link>
  )
}
