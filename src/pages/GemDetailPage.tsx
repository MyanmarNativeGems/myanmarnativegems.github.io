import { useParams } from 'react-router'
import { FileText } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { ErrorState } from '../components/common/ErrorState'
import { GemGallery } from '../components/gems/GemGallery'
import { provenance } from '../config/site'
import { useGem } from '../hooks/useGems'
import { formatKyat } from '../lib/currency'
import { formatCarat, gemAltText } from '../lib/utils'

function DetailSkeleton() {
  return (
    <div
      className="grid animate-pulse gap-10 motion-reduce:animate-none md:grid-cols-12 md:gap-14"
      role="status"
      aria-label="Loading gemstone"
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
  const { no } = useParams()
  const { gem, isLoading, error, refetch } = useGem(no)

  return (
    <div className="py-12 md:py-20">
      <Container>
        {isLoading ? (
          <DetailSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : !gem ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h1 className="font-serif text-3xl font-medium md:text-4xl">
              Stone not found
            </h1>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Gem No. {no} is not part of the current collection. It may have
              been removed or the link may be out of date.
            </p>
            <Button to="/gems" variant="outline" className="mt-8">
              View the Collection
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <GemGallery images={gem.images} alt={gemAltText(gem)} />
            </div>

            <div className="md:col-span-5">
              <h1 className="font-serif text-4xl font-medium md:text-5xl">
                {gem.gemType}
              </h1>
              {gem.carat !== undefined && (
                <p className="mt-2 text-lg text-ink-soft">
                  {formatCarat(gem.carat)}
                </p>
              )}

              <div className="mt-7">
                {gem.isSold ? (
                  <p className="text-sm font-medium uppercase tracking-[0.14em] text-ink-soft">
                    Sold
                  </p>
                ) : gem.priceKyat !== undefined ? (
                  <p className="text-2xl">{formatKyat(gem.priceKyat)}</p>
                ) : (
                  <p className="text-lg text-ink-soft">Price on request</p>
                )}
              </div>

              {gem.certificateUrl && (
                <a
                  href={gem.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
                >
                  <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  View certificate
                </a>
              )}

              <div className="mt-9">
                {gem.isSold ? (
                  <>
                    <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                      This stone has been sold. Similar stones may be
                      available on request.
                    </p>
                    <Button to="/gems" variant="outline" className="mt-5">
                      View Available Gems
                    </Button>
                  </>
                ) : (
                  <Button to={`/contact?gem=${gem.no}`} variant="ruby">
                    Inquire About This Gem
                  </Button>
                )}
              </div>

              <div className="mt-12">
                <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-gold-deep">
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-line border-t border-line">
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">Gem Type</dt>
                    <dd>{gem.gemType}</dd>
                  </div>
                  {gem.carat !== undefined && (
                    <div className="flex justify-between gap-6 py-3 text-sm">
                      <dt className="text-ink-soft">Carat</dt>
                      <dd>{formatCarat(gem.carat)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">Gem No.</dt>
                    <dd>{gem.no}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">Origin</dt>
                    <dd>{provenance.origin}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">Treatment</dt>
                    <dd>{provenance.treatment}</dd>
                  </div>
                  <div className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-soft">Availability</dt>
                    <dd>{gem.isSold ? 'Sold' : 'Available'}</dd>
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
