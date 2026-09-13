import type { ContentDocument } from '../../types/content'
import { Container } from '../common/Container'

export function EditorialHero({ document }: { document: ContentDocument }) {
  const { frontmatter } = document
  return (
    <header className="border-b border-line py-14 md:py-20">
      <Container>
        <div className="max-w-3xl">
          {frontmatter.eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
              {frontmatter.eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {frontmatter.description}
            </p>
          )}
        </div>
        {frontmatter.heroImage && (
          <img
            src={frontmatter.heroImage}
            alt=""
            className="mt-10 max-h-[440px] w-full object-cover"
          />
        )}
      </Container>
    </header>
  )
}
