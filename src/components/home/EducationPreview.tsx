import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { ArticleCard } from '../content/ArticleCard'
import { listContent } from '../../lib/markdown'
import type { Locale } from '../../i18n'

export function EducationPreview() {
  const { t, i18n } = useTranslation()
  const articles = listContent('education', i18n.language as Locale)

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            {t('common.learnTitle')}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {t('common.learnSubtitle')}
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
