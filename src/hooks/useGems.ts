import { useQuery } from '@tanstack/react-query'
import { fetchGems } from '../lib/googleSheets'
import { mockGems } from '../data/mockGems'
import type { Gem } from '../types/gem'

const SHEET_URL = import.meta.env.VITE_GEMS_SHEET_URL as string | undefined

async function loadGems(): Promise<Gem[]> {
  if (!SHEET_URL) {
    if (import.meta.env.DEV) {
      console.info(
        '[Myanmar Native Gems] VITE_GEMS_SHEET_URL is not set. Serving mock inventory ' +
          '(development only). Copy env.example to .env.local to use the live Sheet.',
      )
      return mockGems
    }
    // In production a missing Sheet URL is a configuration error;
    // fake inventory must never be shown to visitors.
    throw new Error('Inventory source is not configured.')
  }
  return fetchGems(SHEET_URL)
}

export function useGems() {
  const query = useQuery({
    queryKey: ['gems'],
    queryFn: loadGems,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  return {
    gems: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useGem(no: string | undefined) {
  const { gems, isLoading, error, refetch } = useGems()
  return {
    gem: no ? gems.find((gem) => gem.no === no) : undefined,
    isLoading,
    error,
    refetch,
  }
}
