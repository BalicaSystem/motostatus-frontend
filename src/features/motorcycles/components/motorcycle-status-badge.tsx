import { Badge } from '#/components/ui/badge'
import type { Motorcycle } from '../types/motorcycle'

const statusConfig = {
  in_transit: {
    label: 'Em trânsito',
    variant: 'outline',
  },
  delayed: {
    label: 'Atrasada',
    variant: 'destructive',
  },
  arrived: {
    label: 'Chegou',
    variant: 'default',
  },
} satisfies Record<
  Motorcycle['status'],
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
>

type MotorcycleStatusBadgeProps = {
  status: Motorcycle['status']
}

export function MotorcycleStatusBadge({
  status,
}: MotorcycleStatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}