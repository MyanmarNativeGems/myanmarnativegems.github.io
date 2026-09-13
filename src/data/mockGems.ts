import type { Gem } from '../types/gem'

/**
 * DEVELOPMENT-ONLY sample inventory.
 * Used exclusively when VITE_GEMS_SHEET_URL is missing in dev mode.
 * Never shown in production and never merged with live Sheet data.
 * All values below are illustrative, not real stones.
 */
export const mockGems: Gem[] = [
  {
    no: '1',
    gemType: 'Ruby',
    carat: 1.25,
    priceKyat: 4_800_000,
    isSold: false,
    images: ['/images/gems/ruby.svg'],
  },
  {
    no: '2',
    gemType: 'Sapphire',
    carat: 2.1,
    priceKyat: 6_500_000,
    isSold: false,
    images: ['/images/gems/sapphire.svg'],
  },
  {
    no: '3',
    gemType: 'Jade',
    carat: 3.4,
    priceKyat: 2_900_000,
    isSold: true,
    images: ['/images/gems/jade.svg'],
  },
  {
    no: '4',
    gemType: 'Spinel',
    carat: 1.8,
    priceKyat: 1_950_000,
    isSold: false,
    images: ['/images/gems/spinel.svg', '/images/gems/ruby.svg'],
  },
  {
    no: '5',
    gemType: 'Ruby',
    carat: 0.95,
    priceKyat: 3_200_000,
    isSold: false,
    // No images on purpose: exercises the placeholder rendering path.
    images: [],
  },
  {
    no: '6',
    gemType: 'Sapphire',
    carat: 4.05,
    priceKyat: 12_500_000,
    isSold: true,
    images: ['/images/gems/sapphire.svg'],
  },
]
