import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { ErrorState } from '../components/common/ErrorState'
import { GemGridSkeleton } from '../components/common/LoadingSkeleton'
import { GemFilters } from '../components/gems/GemFilters'
import { GemGrid } from '../components/gems/GemGrid'
import { usePageMeta } from '../hooks/usePageMeta'
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
  const { t } = useTranslation()
  usePageMeta(t('meta.gems.title'), t('meta.gems.description'))
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
            {t('gems.title')}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t('gems.subtitle')}
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
                {t('common.newStonesMessage')}
              </p>
              <Button to="/contact" variant="outline" className="mt-7">
                {t('common.makeInquiry')}
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="max-w-xl">
              <p className="leading-relaxed text-ink-soft">
                {t('gems.noMatchMessage')}
              </p>
              <Button
                variant="outline"
                className="mt-7"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                {t('gems.clearFilters')}
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
