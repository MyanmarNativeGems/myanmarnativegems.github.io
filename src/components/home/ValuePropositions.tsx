import { Container } from '../common/Container'

const VALUES = [
  {
    title: 'Mined in Mogok',
    body: 'Every stone we sell comes from Mogok, the valley in northern Myanmar celebrated for its rubies and spinels for centuries.',
  },
  {
    title: 'Natural and Untreated',
    body: 'Our stones are 100% natural, with no heat and no other treatments. What you see is how the stone came out of the ground.',
  },
  {
    title: 'Personal Service',
    body: 'Every inquiry is answered personally. Ask for more photographs, more detail, or a conversation.',
  },
]

export function ValuePropositions() {
  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container className="grid gap-10 md:grid-cols-12">
        <h2 className="font-serif text-3xl font-medium md:col-span-4 md:text-4xl">
          Why Burma Gems
        </h2>
        <div className="md:col-span-8">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="grid gap-2 border-t border-line py-6 first:border-t-0 first:pt-0 md:grid-cols-[220px_1fr] md:gap-6 md:py-7"
            >
              <h3 className="font-serif text-xl font-medium">{value.title}</h3>
              <p className="leading-relaxed text-ink-soft">{value.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
