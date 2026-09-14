import { useTranslation } from 'react-i18next'
import { Container } from '../components/common/Container'
import { ArticleCard } from '../components/content/ArticleCard'
import { usePageMeta } from '../hooks/usePageMeta'
import { listContent } from '../lib/markdown'
import type { Locale } from '../i18n'

export function EducationPage() {
  const { t, i18n } = useTranslation()
  usePageMeta(t('meta.education.title'), t('meta.education.description'))
  const articles = listContent('education', i18n.language as Locale)

  return (
    <div className="py-14 md:py-20">
      <Container>
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            {t('common.learnTitle')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t('common.learnSubtitle')}
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
