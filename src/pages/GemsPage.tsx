import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { ErrorState } from '../components/common/ErrorState'
import { GemGridSkeleton } from '../components/common/LoadingSkeleton'
import { GemFilters } from '../components/gems/GemFilters'
import { GemGrid } from '../components/gems/GemGrid'
import { useGems } from '../hooks/useGems'
import {
  deriveGemTypes,
  filterAndSortGems,
  type GemFilterState,
} from '../lib/utils'

const DEFAULT_FILTERS: GemFilterState = {
  type: 'all',
  availableOnly: false,
  search: '',
  sort: 'no',
}

export function GemsPage() {
  const { gems, isLoading, error, refetch } = useGems()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<GemFilterState>(() => ({
    ...DEFAULT_FILTERS,
    type: searchParams.get('type') ?? 'all',
  }))

  const gemTypes = useMemo(() => deriveGemTypes(gems), [gems])
  const visible = useMemo(
    () => filterAndSortGems(gems, filters),
    [gems, filters],
  )

  return (
    <div className="py-14 md:py-20">
      <Container>
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            The Collection
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            A curated selection of individual cut gemstones.
          </p>
        </header>

        {!isLoading && !error && gems.length > 0 && (
          <GemFilters
            className="mt-12"
            gemTypes={gemTypes}
            value={filters}
            onChange={setFilters}
          />
        )}

        <div className="mt-12">
          {isLoading ? (
            <GemGridSkeleton count={8} />
          ) : error ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : gems.length === 0 ? (
            <div className="max-w-xl">
              <p className="leading-relaxed text-ink-soft">
                New stones are being added to the collection. Contact us to
                hear about upcoming availability.
              </p>
              <Button to="/contact" variant="outline" className="mt-7">
                Make an Inquiry
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="max-w-xl">
              <p className="leading-relaxed text-ink-soft">
                No stones match your current filters.
              </p>
              <Button
                variant="outline"
                className="mt-7"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <GemGrid gems={visible} />
          )}
        </div>
      </Container>
    </div>
  )
}
