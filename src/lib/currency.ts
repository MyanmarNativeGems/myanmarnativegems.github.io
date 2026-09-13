const kyatFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** Formats a Kyat amount for display, e.g. 4800000 -> "4,800,000 Ks". */
export function formatKyat(price: number): string {
  return `${kyatFormatter.format(price)} Ks`
}
