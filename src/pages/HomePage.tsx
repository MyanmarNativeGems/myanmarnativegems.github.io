import { Hero } from '../components/home/Hero'
import { GemstoneCategories } from '../components/home/GemstoneCategories'
import { FeaturedGems } from '../components/home/FeaturedGems'
import { ValuePropositions } from '../components/home/ValuePropositions'
import { EducationPreview } from '../components/home/EducationPreview'
import { InquiryCTA } from '../components/home/InquiryCTA'

export function HomePage() {
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
