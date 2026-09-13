import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'

export function NotFoundPage() {
  return (
    <Container className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-4xl font-medium md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          The page you are looking for does not exist or may have moved.
        </p>
        <Button to="/" variant="outline" className="mt-8">
          Back to Home
        </Button>
      </div>
    </Container>
  )
}
