import { Button } from '../common/Button'
import { Container } from '../common/Container'

export function InquiryCTA() {
  return (
    <section className="border-t border-line bg-ivory-deep py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium md:text-4xl">
            Interested in a Gemstone?
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            Contact us for availability, additional photos, or questions
            about a stone.
          </p>
          <Button to="/contact" variant="ruby" className="mt-9">
            Make an Inquiry
          </Button>
        </div>
      </Container>
    </section>
  )
}
