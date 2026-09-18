import { Badge } from '#/components/ui/badge'
import type { OrderStatus } from '../types/order'

const statusConfig = {
  active: {
    label: 'Ativo',
    variant: 'default',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
  },
} satisfies Record<
  OrderStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
>

type OrderStatusBadgeProps = {
  status: OrderStatus
}

export function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}