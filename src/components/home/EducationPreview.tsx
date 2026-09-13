import { Container } from '../common/Container'
import { ArticleCard } from '../content/ArticleCard'
import { listContent } from '../../lib/markdown'

export function EducationPreview() {
  const articles = listContent('education')

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            Learn About Gemstones
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Plain, practical guides to reading a stone before you buy.
          </p>
        </div>
        <div className="mt-10 grid gap-x-12 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} document={article} />
          ))}
        </div>
      </Container>
    </section>
  )
}
