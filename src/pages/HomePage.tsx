import { useTranslation } from 'react-i18next'
import { Hero } from '../components/home/Hero'
import { GemstoneCategories } from '../components/home/GemstoneCategories'
import { FeaturedGems } from '../components/home/FeaturedGems'
import { ValuePropositions } from '../components/home/ValuePropositions'
import { EducationPreview } from '../components/home/EducationPreview'
import { InquiryCTA } from '../components/home/InquiryCTA'
import { usePageMeta } from '../hooks/usePageMeta'

export function HomePage() {
  const { t } = useTranslation()
  usePageMeta(t('meta.home.title'), t('meta.home.description'))

  return (
    <>
      <Hero />
      <GemstoneCategories />
      <FeaturedGems />
      <ValuePropositions />
      <EducationPreview />
      <InquiryCTA />
    </>
  )
}
