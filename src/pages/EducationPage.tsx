import { Container } from '../components/common/Container'
import { ArticleCard } from '../components/content/ArticleCard'
import { listContent } from '../lib/markdown'

export function EducationPage() {
  const articles = listContent('education')

  return (
    <div className="py-14 md:py-20">
      <Container>
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            Learn About Gemstones
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Plain, practical guides to reading a stone before you buy.
          </p>
        </header>
        <div className="mt-12 grid gap-x-12 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} document={article} />
          ))}
        </div>
      </Container>
    </div>
  )
}
