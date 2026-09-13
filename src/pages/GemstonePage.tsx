import { useMemo } from 'react'
import { Link } from 'react-router'
import { Container } from '../components/common/Container'
import { ErrorState } from '../components/common/ErrorState'
import { GemGridSkeleton } from '../components/common/LoadingSkeleton'
import { GemGrid } from '../components/gems/GemGrid'
import { InquiryCTA } from '../components/home/InquiryCTA'
import { gemstoneCategories, type GemstoneCategory } from '../config/gemstones'
import { useGems } from '../hooks/useGems'
import { getContent } from '../lib/markdown'

/**
 * Reusable landing page for one gemstone category (/ruby, /sapphire, ...).
 * Short editorial content comes from the matching Markdown guide;
 * inventory comes from the live Sheet.
 */
export function GemstonePage({ category }: { category: GemstoneCategory }) {
  const guide = getContent('education', category.guideSlug)
  const { gems, isLoading, error, refetch } = useGems()

  const matching = useMemo(() => {
    const keyword = category.keyword
    if (!keyword) {
      // Catch-all "Others" category: anything that isn't one of the named
      // gemstone types gets listed here instead of disappearing silently.
      const namedKeywords = gemstoneCategories
        .map((c) => c.keyword)
        .filter((k): k is string => Boolean(k))
      return gems.filter(
        (gem) =>
          !namedKeywords.some((namedKeyword) =>
            gem.gemType.toLowerCase().includes(namedKeyword),
          ),
      )
    }
    return gems.filter((gem) => gem.gemType.toLowerCase().includes(keyword))
  }, [gems, category.keyword])

  return (
    <article>
      <section className="border-b border-line">
        <Container className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-14 md:py-20">
          <div className="md:col-span-6">
            <h1 className="font-serif text-4xl font-medium md:text-5xl">
              {category.name}
            </h1>
            {guide?.frontmatter.description && (
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                {guide.frontmatter.description}
              </p>
            )}
            {guide && (
              <Link
                to={`/education/${guide.slug}`}
                className="mt-6 inline-block text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
              >
                Read the {category.name.toLowerCase()} guide
              </Link>
            )}
          </div>
          <div className="md:col-span-6">
            <img
              src={category.image}
              alt=""
              className="h-[280px] w-full bg-ivory-deep object-cover md:h-[380px]"
            />
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <h2 className="font-serif text-2xl font-medium md:text-3xl">
            In the Collection
          </h2>
          <div className="mt-10">
            {isLoading ? (
              <GemGridSkeleton count={4} />
            ) : error ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : matching.length === 0 ? (
              <div className="max-w-xl">
                <p className="leading-relaxed text-ink-soft">
                  No {category.name.toLowerCase()} stones are listed right
                  now. New stones are added as they are acquired.
                </p>
                <Link
                  to="/gems"
                  className="mt-5 inline-block text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
                >
                  View the full collection
                </Link>
              </div>
            ) : (
              <GemGrid gems={matching} />
            )}
          </div>
        </Container>
      </section>

      <InquiryCTA />
    </article>
  )
}
