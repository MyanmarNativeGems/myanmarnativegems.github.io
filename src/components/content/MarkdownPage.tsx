import type { ContentDocument } from '../../types/content'
import { Container } from '../common/Container'
import { EditorialHero } from './EditorialHero'
import { MarkdownContent } from './MarkdownContent'

/** Full editorial page: hero header plus rendered Markdown body. */
export function MarkdownPage({ document }: { document: ContentDocument }) {
  return (
    <article>
      <EditorialHero document={document} />
      <section className="py-14 md:py-20">
        <Container>
          <MarkdownContent content={document.content} />
        </Container>
      </section>
    </article>
  )
}
