import { useTranslation } from 'react-i18next'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  const { t } = useTranslation()
  usePageMeta(t('meta.notFound.title'))

  return (
    <Container className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-4xl font-medium md:text-5xl">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          {t('notFound.message')}
        </p>
        <Button to="/" variant="outline" className="mt-8">
          {t('notFound.backHome')}
        </Button>
      </div>
    </Container>
  )
}
