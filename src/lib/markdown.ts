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

const PATH_PATTERN = /\/src\/content\/(pages|education)\/([^/]+)\.md$/

function buildCollections(): Record<ContentCollection, ContentDocument[]> {
  const collections: Record<ContentCollection, ContentDocument[]> = {
    pages: [],
    education: [],
  }

  for (const [path, raw] of Object.entries(rawFiles)) {
    const match = path.match(PATH_PATTERN)
    if (!match) continue
    const collection = match[1] as ContentCollection
    const document = buildDocument(match[2], raw)
    if (document.frontmatter.published === false) continue
    collections[collection].push(document)
  }

  for (const documents of Object.values(collections)) {
    documents.sort(
      (a, b) =>
        (a.frontmatter.order ?? Number.MAX_SAFE_INTEGER) -
          (b.frontmatter.order ?? Number.MAX_SAFE_INTEGER) ||
        a.frontmatter.title.localeCompare(b.frontmatter.title),
    )
  }

  return collections
}

const collections = buildCollections()

export function listContent(collection: ContentCollection): ContentDocument[] {
  return collections[collection]
}

export function getContent(
  collection: ContentCollection,
  slug: string,
): ContentDocument | undefined {
  return collections[collection].find((document) => document.slug === slug)
}
