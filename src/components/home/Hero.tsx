import { Link } from 'react-router'
import { Button } from '../common/Button'
import { Container } from '../common/Container'
import { siteConfig } from '../../config/site'

export function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-14 md:py-20">
        <div className="md:col-span-5">
          <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            {siteConfig.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button to="/gems">Explore Gemstones</Button>
            <Link
              to="/about"
              className="text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="md:col-span-7">
          <img
            src="/images/home/hero.jpg"
            alt="Rough ruby crystal on white marble matrix"
            fetchPriority="high"
            className="h-[380px] w-full object-cover md:h-[520px]"
          />
        </div>
      </Container>
    </section>
  )
}
