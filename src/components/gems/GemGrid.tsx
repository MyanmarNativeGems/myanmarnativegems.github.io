import type { Gem } from '../../types/gem'
import { cn, gemGridClass, type GemGridVariant } from '../../lib/utils'
import { GemCard } from './GemCard'

export function GemGrid({
  gems,
  variant = 'catalog',
  className,
}: {
  gems: Gem[]
  variant?: GemGridVariant
  className?: string
}) {
  return (
    <div className={cn(gemGridClass[variant], className)}>
      {gems.map((gem) => (
        <GemCard key={gem.no} gem={gem} />
      ))}
    </div>
  )
}
