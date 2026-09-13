import { Link } from 'react-router'
import { Container } from '../common/Container'
import { ErrorState } from '../common/ErrorState'
import { GemGridSkeleton } from '../common/LoadingSkeleton'
import { GemGrid } from '../gems/GemGrid'
import { useGems } from '../../hooks/useGems'
import { selectFeaturedGems } from '../../lib/utils'

export function FeaturedGems() {
  const { gems, isLoading, error, refetch } = useGems()
  const featured = selectFeaturedGems(gems)

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            Featured Gemstones
          </h2>
          <Link
            to="/gems"
            className="text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
          >
            Explore Gemstones
          </Link>
        </div>
        <div className="mt-10">
          {isLoading ? (
            <GemGridSkeleton count={4} variant="quad" />
          ) : error ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : featured.length === 0 ? (
            <p className="max-w-xl leading-relaxed text-ink-soft">
              New stones are being added to the collection. Contact us to
              hear about upcoming availability.
            </p>
          ) : (
            <GemGrid gems={featured} variant="quad" />
          )}
        </div>
      </Container>
    </section>
  )
}
