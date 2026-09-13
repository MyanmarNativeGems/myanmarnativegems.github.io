import Papa from 'papaparse'
import type { Gem, GemSheetRow } from '../types/gem'
import { compareGemNo } from './utils'

/**
 * Inventory data layer.
 *
 * Google Sheet -> published CSV endpoint -> fetch -> PapaParse ->
 * GemSheetRow[] -> normalize -> Gem[].
 *
 * The Sheet is fetched at runtime, so inventory edits appear on the site
 * without a rebuild. All raw header handling stays inside this module.
 *
 * Header matching is normalization-based (lowercase, alphanumerics only)
 * because the live Sheet's header spellings have already changed more than
 * once ("Image 1 Link" -> "image1_link"). Any of the spellings below work.
 */

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Accepted normalized header spellings per field, first match wins. */
const HEADER_ALIASES = {
  no: ['itemno', 'no', 'gemno'],
  gemType: ['gemtype', 'type'],
  carat: ['caratct', 'carat', 'weight'],
  price: ['pricekyat', 'price'],
  isSold: ['issoldyn', 'issold', 'sold'],
  certificate: ['certificatelink', 'certificate', 'certlink'],
  image1: ['image1link', 'imageurl1', 'image1', 'imagelink1'],
  image2: ['image2link', 'imageurl2', 'image2', 'imagelink2'],
} as const

function devWarn(...args: unknown[]): void {
  if (import.meta.env?.DEV) {
    console.warn('[Myanmar Native Gems inventory]', ...args)
  }
}

function toLookup(row: GemSheetRow): Map<string, string> {
  const lookup = new Map<string, string>()
  for (const [key, value] of Object.entries(row)) {
    if (typeof value !== 'string') continue
    const normalized = normalizeHeader(key)
    if (normalized && !lookup.has(normalized)) {
      lookup.set(normalized, value.trim())
    }
  }
  return lookup
}

function pick(lookup: Map<string, string>, aliases: readonly string[]): string {
  for (const alias of aliases) {
    const value = lookup.get(alias)
    if (value) return value
  }
  return ''
}

/**
 * Parses a positive number, tolerating thousands separators and a trailing
 * unit ("1.21ct", "4,800,000 Ks"). Anything else -> undefined, never a crash.
 */
function parseOptionalNumber(raw: string): number | undefined {
  if (!raw) return undefined
  const cleaned = raw
    .replace(/[,\s]/g, '')
    .replace(/(?:ct|cts|carats?|ks|kyats?|mmk)$/i, '')
  const value = Number(cleaned)
  return Number.isFinite(value) && value > 0 ? value : undefined
}

const SOLD_VALUES = new Set(['y', 'yes', 'true'])
const AVAILABLE_VALUES = new Set(['', 'n', 'no', 'false'])

/**
 * Normalizes the sold flag. A blank cell means available (the common Sheet
 * idiom). An unrecognized value is treated as sold, so a malformed row can
 * never invite inquiries about a stone that may be unavailable.
 */
function parseSold(raw: string, no: string): boolean {
  const value = raw.toLowerCase()
  if (SOLD_VALUES.has(value)) return true
  if (AVAILABLE_VALUES.has(value)) return false
  devWarn(`Gem No. ${no}: unrecognized sold value "${raw}", treating as sold.`)
  return true
}

const DRIVE_FILE_PATTERN =
  /drive\.google\.com\/(?:file\/d\/([\w-]+)|open\?id=([\w-]+)|uc\?(?:[\w=&]*?)id=([\w-]+))/

/**
 * Google Drive "viewer" links (the kind copied from the Drive UI) serve an
 * HTML page, not image bytes, so they fail inside <img>. Rewrite them to the
 * direct-content host. The file must be shared as "anyone with the link".
 * Non-Drive URLs pass through untouched.
 */
export function toDirectImageUrl(url: string): string {
  const match = url.match(DRIVE_FILE_PATTERN)
  const fileId = match?.[1] ?? match?.[2] ?? match?.[3]
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1600` : url
}

/** Maps one raw Sheet row to a Gem. Returns null for rows that must be skipped. */
export function mapRowToGem(row: GemSheetRow): Gem | null {
  const lookup = toLookup(row)
  const hasAnyValue = [...lookup.values()].some((value) => value.length > 0)
  if (!hasAnyValue) return null

  const no = pick(lookup, HEADER_ALIASES.no)
  if (!no) {
    devWarn('Skipping a row without a gem number:', row)
    return null
  }

  const images = [
    pick(lookup, HEADER_ALIASES.image1),
    pick(lookup, HEADER_ALIASES.image2),
  ]
    .filter((url) => url.length > 0)
    .map(toDirectImageUrl)

  return {
    no,
    gemType: pick(lookup, HEADER_ALIASES.gemType) || 'Gemstone',
    carat: parseOptionalNumber(pick(lookup, HEADER_ALIASES.carat)),
    priceKyat: parseOptionalNumber(pick(lookup, HEADER_ALIASES.price)),
    isSold: parseSold(pick(lookup, HEADER_ALIASES.isSold), no),
    certificateUrl: pick(lookup, HEADER_ALIASES.certificate) || undefined,
    images,
  }
}

/** Parses published CSV text into normalized gems, ordered by gem number. */
export function parseGemsCsv(csv: string): Gem[] {
  const result = Papa.parse<GemSheetRow>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  })

  for (const error of result.errors) {
    devWarn(`CSV parse notice (row ${error.row ?? '?'}): ${error.message}`)
  }

  return result.data
    .map(mapRowToGem)
    .filter((gem): gem is Gem => gem !== null)
    .sort(compareGemNo)
}

/** Fetches and parses the live inventory. Throws on HTTP failure so retries engage. */
export async function fetchGems(csvUrl: string): Promise<Gem[]> {
  const response = await fetch(csvUrl)
  if (!response.ok) {
    throw new Error(`Inventory request failed with status ${response.status}`)
  }
  return parseGemsCsv(await response.text())
}
