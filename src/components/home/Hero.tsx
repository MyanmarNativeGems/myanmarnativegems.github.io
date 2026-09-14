import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/Button'
import { Container } from '../common/Container'

export function Hero() {
  const { t } = useTranslation()
  return (
    <section className="border-b border-line">
      <Container className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-14 md:py-20">
        <div className="md:col-span-5">
          <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            {t('site.tagline')}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            {t('site.description')}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button to="/gems">{t('common.exploreGemstones')}</Button>
            <Link
              to="/about"
              className="text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
            >
              {t('common.ourStory')}
            </Link>
          </div>
        </div>
        <div className="md:col-span-7">
          <img
            src="/images/home/hero.jpg"
            alt={t('home.hero.imageAlt')}
            fetchPriority="high"
            className="h-[380px] w-full object-cover md:h-[520px]"
          />
        </div>
      </Container>
    </section>
  )
}
