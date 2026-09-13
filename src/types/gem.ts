/**
 * Raw CSV row as published by the inventory Google Sheet.
 * Internal to the data layer; UI components never touch these headers.
 *
 * Header spellings in the live Sheet have already changed more than once,
 * so the data layer matches headers by normalized name (lowercased,
 * alphanumerics only). The fields below document the known spellings; the
 * index signature covers future renames.
 */
export interface GemSheetRow {
  'Item No'?: string
  No?: string
  'Gem Type'?: string
  'Carat (ct)'?: string
  'Price (Kyat)'?: string
  'Is Sold (Y/N)'?: string
  'Certificate Link'?: string
  Certificate_Link?: string
  'Image 1 Link'?: string
  'Image URL 1'?: string
  image1_link?: string
  'Image 2 Link'?: string
  'Image URL 2'?: string
  image2_link?: string
  [header: string]: string | undefined
}

/** Normalized gem used by every React component. */
export interface Gem {
  /** Stable identifier from the Sheet's "Item No" column. */
  no: string
  gemType: string
  carat?: number
  priceKyat?: number
  isSold: boolean
  certificateUrl?: string
  images: string[]
}
