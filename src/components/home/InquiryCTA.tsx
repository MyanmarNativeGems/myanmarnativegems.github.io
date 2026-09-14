import { useTranslation } from 'react-i18next'
import { Button } from '../common/Button'
import { Container } from '../common/Container'

export function InquiryCTA() {
  const { t } = useTranslation()
  return (
    <section className="border-t border-line bg-ivory-deep py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            {t('home.cta.title')}
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            {t('home.cta.body')}
          </p>
          <Button to="/contact" variant="ruby" className="mt-9">
            {t('common.makeInquiry')}
          </Button>
        </div>
      </Container>
    </section>
  )
}
