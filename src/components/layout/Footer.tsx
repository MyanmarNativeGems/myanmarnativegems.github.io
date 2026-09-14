import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Container } from '../common/Container'
import { gemstoneCategories } from '../../config/gemstones'
import { siteConfig } from '../../config/site'
import { listContent } from '../../lib/markdown'
import type { Locale } from '../../i18n'

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ to: string; label: string }>
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-gold-deep">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const guides = listContent('education', locale)

  return (
    <footer className="border-t border-line bg-ivory-deep">
      <Container className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr_1fr] md:py-20">
        <div className="max-w-xs">
          <p className="font-serif text-lg font-semibold uppercase tracking-[0.22em]">
            {siteConfig.name}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {t('site.description')}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-block text-sm underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
          >
            {siteConfig.email}
          </a>
          {siteConfig.instagram && (
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              {t('footer.instagram')}
            </a>
          )}
        </div>

        <FooterColumn
          title={t('footer.gemstonesTitle')}
          links={[
            ...gemstoneCategories.map((category) => ({
              to: `/${category.slug}`,
              label: t(`gemstones.${category.slug}.name`),
            })),
            { to: '/gems', label: t('footer.viewAll') },
          ]}
        />

        <FooterColumn
          title={t('footer.learnTitle')}
          links={guides.map((guide) => ({
            to: `/education/${guide.slug}`,
            label: guide.frontmatter.title,
          }))}
        />

        <FooterColumn
          title={t('footer.aboutTitle')}
          links={[
            { to: '/about', label: t('common.ourStory') },
            { to: '/contact', label: t('nav.inquire') },
          ]}
        />
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-ink-soft md:flex-row md:items-center md:justify-between">
          <p>
            {t('footer.copyright', {
              year: new Date().getFullYear(),
              brand: siteConfig.name,
            })}
          </p>
          <p>{t('footer.disclaimer')}</p>
        </Container>
      </div>
    </footer>
  )
}
