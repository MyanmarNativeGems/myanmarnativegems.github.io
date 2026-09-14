import { LOCALES, type Locale } from '../i18n'
import type {
  ContentCollection,
  ContentDocument,
  ContentFrontmatter,
} from '../types/content'

/**
 * Markdown content layer.
 *
 * Editorial content lives in src/content/**\/*.md and is bundled at build
 * time via import.meta.glob, so publishing a content change means committing
 * to main (GitHub Actions rebuilds the site). Frontmatter is a fixed, flat
 * set of scalar fields, parsed by the small browser-safe parser below
 * (gray-matter depends on Node's Buffer and breaks in browser bundles).
 *
 * Each document has an English file (`<slug>.md`) and, where translated, a
 * `<slug>.<locale>.md` sibling (e.g. `<slug>.my.md`, `<slug>.zh.md`)
 * sharing the same `slug`. All are indexed per locale; requesting a
 * document that has no translation for a given locale yet falls back to
 * the English one rather than 404ing.
 */

const rawFiles = import.meta.glob('/src/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

type ScalarValue = string | number | boolean

function parseScalar(raw: string): ScalarValue {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw)
  return raw.replace(/^(['"])(.*)\1$/, '$2')
}

function parseFrontmatterBlock(block: string): Record<string, ScalarValue> {
  const data: Record<string, ScalarValue> = {}
  for (const line of block.split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key && value) data[key] = parseScalar(value)
  }
  return data
}

function asString(value: ScalarValue | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function asNumber(value: ScalarValue | undefined): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function asBoolean(value: ScalarValue | undefined): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function asTemplate(
  value: ScalarValue | undefined,
): ContentFrontmatter['template'] {
  return value === 'editorial' || value === 'guide' || value === 'simple'
    ? value
    : undefined
}

function humanize(fileSlug: string): string {
  return fileSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function buildDocument(fileSlug: string, raw: string): ContentDocument {
  const match = raw.match(FRONTMATTER_PATTERN)
  const data = match ? parseFrontmatterBlock(match[1]) : {}
  const content = match ? raw.slice(match[0].length) : raw

  const frontmatter: ContentFrontmatter = {
    title: asString(data.title) ?? humanize(fileSlug),
    description: asString(data.description),
    slug: asString(data.slug),
    heroImage: asString(data.heroImage),
    eyebrow: asString(data.eyebrow),
    order: asNumber(data.order),
    published: asBoolean(data.published),
    template: asTemplate(data.template),
  }

  return {
    slug: frontmatter.slug ?? fileSlug,
    frontmatter,
    content,
  }
}

// Captures the collection, the file-name slug, and an optional locale
// suffix, e.g. "/src/content/education/ruby-guide.my.md" or "...zh.md".
const PATH_PATTERN =
  /\/src\/content\/(pages|education)\/([^/]+?)(?:\.([a-z]{2}))?\.md$/

type LocaleCollections = Record<Locale, Record<ContentCollection, ContentDocument[]>>

function emptyCollections(): Record<ContentCollection, ContentDocument[]> {
  return { pages: [], education: [] }
}

function isContentLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

function buildCollections(): LocaleCollections {
  const collections = Object.fromEntries(
    LOCALES.map((locale) => [locale, emptyCollections()]),
  ) as LocaleCollections

  for (const [path, raw] of Object.entries(rawFiles)) {
    const match = path.match(PATH_PATTERN)
    if (!match) continue
    const collection = match[1] as ContentCollection
    const suffix = match[3]
    // A suffix that isn't a known locale (e.g. a slug that legitimately
    // contains a dot) is treated as part of the slug, not a locale tag —
    // falls back to English.
    const locale: Locale = isContentLocale(suffix) ? suffix : 'en'
    const document = buildDocument(match[2], raw)
    if (document.frontmatter.published === false) continue
    collections[locale][collection].push(document)
  }

  for (const localeCollections of Object.values(collections)) {
    for (const documents of Object.values(localeCollections)) {
      documents.sort(
        (a, b) =>
          (a.frontmatter.order ?? Number.MAX_SAFE_INTEGER) -
            (b.frontmatter.order ?? Number.MAX_SAFE_INTEGER) ||
          a.frontmatter.title.localeCompare(b.frontmatter.title),
      )
    }
  }

  return collections
}

const collections = buildCollections()

/**
 * Lists documents in a collection, in the given locale. Falls back to
 * English per-document (not per-collection) so a partially translated
 * collection still lists every document, just with some in English.
 */
export function listContent(
  collection: ContentCollection,
  locale: Locale = 'en',
): ContentDocument[] {
  if (locale === 'en') return collections.en[collection]
  const localizedBySlug = new Map(
    collections[locale][collection].map((document) => [document.slug, document]),
  )
  return collections.en[collection].map(
    (document) => localizedBySlug.get(document.slug) ?? document,
  )
}

/**
 * Looks up one document by slug in the given locale. Falls back to the
 * English version if a Burmese translation for that slug doesn't exist yet.
 */
export function getContent(
  collection: ContentCollection,
  slug: string,
  locale: Locale = 'en',
): ContentDocument | undefined {
  const localized = collections[locale][collection].find(
    (document) => document.slug === slug,
  )
  if (localized) return localized
  return collections.en[collection].find((document) => document.slug === slug)
}
