import { cn } from '@/lib/cn'

interface AvailabilityBadgeProps {
  status: 'available' | 'unavailable' | 'limited'
  className?: string
}

const statusText: Record<AvailabilityBadgeProps['status'], string> = {
  available: 'Open to Product / Systems Roles',
  limited: 'Limited availability',
  unavailable: 'Not available',
}

export default function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  return (
    <p className={cn('text-[0.875rem] tracking-wide text-accent', className)}>
      {statusText[status]}
    </p>
  )
}
