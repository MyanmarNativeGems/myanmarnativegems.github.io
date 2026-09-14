import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { ErrorState } from '../components/common/ErrorState'
import { GemCertificate } from '../components/gems/GemCertificate'
import { GemGallery } from '../components/gems/GemGallery'
import { useGem } from '../hooks/useGems'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatKyat } from '../lib/currency'
import { formatCarat, gemAltText } from '../lib/utils'
import { translateGemType } from '../i18n/gemTypes'
import type { Locale } from '../i18n'

function DetailSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      className="grid animate-pulse gap-10 motion-reduce:animate-none md:grid-cols-12 md:gap-14"
      role="status"
      aria-label={ariaLabel}
    >
      <div className="md:col-span-7">
        <div className="aspect-square bg-ivory-deep" />
      </div>
      <div className="md:col-span-5">
        <div className="h-10 w-3/5 bg-ivory-deep" />
        <div className="mt-4 h-5 w-1/4 bg-ivory-deep" />
        <div className="mt-8 h-7 w-2/5 bg-ivory-deep" />
        <div className="mt-10 h-12 w-3/5 bg-ivory-deep" />
      </div>
    </div>
  )
}

export function GemDetailPage() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const { no } = useParams()
  const { gem, isLoading, error, refetch } = useGem(no)
  const typeLabel = gem ? translateGemType(gem.gemType, locale) : undefined

  usePageMeta(
    typeLabel && gem
      ? `${typeLabel} ${t('gem.stoneNoPrefix', { no: gem.no })}`
      : t('gemDetail.notFoundTitle'),
    t('meta.gemDetail.description'),
  )

  return (
    <div className="py-12 md:py-20">
      <Container>
        {isLoading ? (
          <DetailSkeleton ariaLabel={t('gemDetail.loadingAria')} />
        ) : error ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : !gem ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h1 className="font-serif text-3xl font-medium md:text-4xl">
              {t('gemDetail.notFoundTitle')}
            </h1>
            <p className="mt-4 leading-relaxed text-ink-soft">
              {t('gemDetail.notFoundMessage', { no })}
            </p>
            <Button to="/gems" variant="outline" className="mt-8">
              {t('gemDetail.viewCollection')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <GemGallery
                images={gem.images}
                alt={gemAltText(
                  gem,
                  typeLabel ?? gem.gemType,
                  t('gem.stoneNoPrefix', { no: gem.no }),
                )}
              />
            </div>

            <div className="md:col-span-5">
              <h1 className="font-serif text-4xl font-medium md:text-5xl">
                {typeLabel}
              </h1>
              {gem.carat !== undefined && (
                <p className="mt-2 text-lg text-ink-soft">
                  {formatCarat(gem.carat)}
                </p>
              )}

              <div className="mt-7">
                {gem.isSold ? (
                  <p className="text-sm font-medium uppercase tracking-[0.14em] text-ink-soft">
                    {t('gem.sold')}
                  </p>
                ) : gem.priceKyat !== undefined ? (
                  <p className="text-2xl">{formatKyat(gem.priceKyat)}</p>
                ) : (
                  <p className="text-lg text-ink-soft">
                    {t('gem.priceOnRequest')}
                  </p>
                )}
              </div>

              {gem.certificateUrl && (
                <GemCertificate
                  url={gem.certificateUrl}
                  alt={gemAltText(
                    gem,
                    typeLabel ?? gem.gemType,
                    t('gem.stoneNoPrefix', { no: gem.no }),
                  )}
                  className="mt-7"
                />
              )}

              <div className="mt-9">
                {gem.isSold ? (
                  <>
                    <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                      {t('gemDetail.soldMessage')}
                    </p>
                    <Button to="/gems" variant="outline" className="mt-5">
                      {t('gemDetail.viewAvailable')}
                    </Button>
                  </>
                ) : (
                  <Button to={`/contact?gem=${gem.no}`} variant="ruby">
                    {t('gemDetail.inquireAbout')}
                  </Button>
                )}
              </div>

              <div className="mt-12">
                <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-gold-deep">
                  {t('gemDetail.specifications')}
                </h2>
                <dl className="mt-4 divide-y divide-line border-t border-line">
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">{t('gem.gemTypeLabel')}</dt>
                    <dd>{typeLabel}</dd>
                  </div>
                  {gem.carat !== undefined && (
                    <div className="flex justify-between gap-6 py-3 text-sm">
                      <dt className="text-ink-soft">{t('gem.caratLabel')}</dt>
                      <dd>{formatCarat(gem.carat)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">{t('gem.gemNoLabel')}</dt>
                    <dd>{gem.no}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">{t('gem.originLabel')}</dt>
                    <dd>{t('provenance.originValue')}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">{t('gem.treatmentLabel')}</dt>
                    <dd>{t('provenance.treatmentValue')}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">
                      {t('gem.availabilityLabel')}
                    </dt>
                    <dd>{gem.isSold ? t('gem.sold') : t('gem.available')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
