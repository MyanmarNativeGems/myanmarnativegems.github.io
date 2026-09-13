import type { Gem } from '../types/gem'

/**
 * DEVELOPMENT-ONLY sample inventory.
 * Used exclusively when VITE_GEMS_SHEET_URL is missing in dev mode.
 * Never shown in production and never merged with live Sheet data.
 * All values below are illustrative, not real stones. Covers every
 * category (including "Others") so local dev reflects the same
 * categories production can show.
 */
export const mockGems: Gem[] = [
  {
    no: '1',
    gemType: 'Ruby',
    carat: 1.25,
    priceKyat: 4_800_000,
    isSold: false,
    images: ['/images/gems/ruby.png'],
  },
  {
    no: '2',
    gemType: 'Sapphire',
    carat: 2.1,
    priceKyat: 6_500_000,
    isSold: false,
    images: ['/images/gems/sapphire.png'],
  },
  {
    no: '3',
    gemType: 'Spinel',
    carat: 3.4,
    priceKyat: 2_900_000,
    isSold: true,
    images: ['/images/gems/spinel.png'],
  },
  {
    no: '4',
    gemType: 'Spinel',
    carat: 1.8,
    priceKyat: 1_950_000,
    isSold: false,
    images: ['/images/gems/spinel.png', '/images/gems/ruby.png'],
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
    images: ['/images/gems/sapphire.png'],
  },
  {
    no: '7',
    gemType: 'Zircon',
    carat: 3.43,
    priceKyat: 800_000,
    isSold: false,
    images: ['/images/gems/zircon.png'],
  },
  {
    no: '8',
    gemType: 'Peridot',
    carat: 2.6,
    priceKyat: 650_000,
    isSold: false,
    images: ['/images/gems/peridot.png'],
  },
  {
    no: '9',
    gemType: 'Tourmaline',
    carat: 2.2,
    priceKyat: 1_100_000,
    isSold: false,
    images: ['/images/gems/tourmaline.png'],
  },
  {
    no: '10',
    gemType: 'Garnet',
    carat: 1.5,
    priceKyat: 400_000,
    isSold: false,
    // Deliberately not one of the named categories: exercises "Others".
    images: ['/images/gems/other.png'],
  },
]
