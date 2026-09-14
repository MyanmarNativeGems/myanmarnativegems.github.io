import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { siteConfig } from '../../config/site'

const VALUE_KEYS = [
  'minedInMogok',
  'naturalUntreated',
  'personalService',
] as const

export function ValuePropositions() {
  const { t } = useTranslation()
  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container className="grid gap-10 md:grid-cols-12">
        <h2 className="font-serif text-3xl font-medium md:col-span-4 md:text-4xl">
          {t('home.values.title', { brand: siteConfig.name })}
        </h2>
        <div className="md:col-span-8">
          {VALUE_KEYS.map((key) => (
            <div
              key={key}
              className="grid gap-2 border-t border-line py-6 first:border-t-0 first:pt-0 md:grid-cols-[220px_1fr] md:gap-6 md:py-7"
            >
              <h3 className="font-serif text-xl font-medium">
                {t(`home.values.${key}.title`)}
              </h3>
              <p className="leading-relaxed text-ink-soft">
                {t(`home.values.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
