import { Link } from 'react-router'
import { Container } from '../common/Container'
import { gemstoneCategories } from '../../config/gemstones'

export function GemstoneCategories() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <h2 className="font-serif text-3xl font-medium md:text-4xl">
          Browse by Gemstone
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-8">
          {gemstoneCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/${category.slug}`}
              className="group block"
            >
              <div className="overflow-hidden">
                <img
                  src={category.image}
                  alt={`${category.name} stones`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <p className="mt-3 text-center font-serif text-xl font-medium">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
