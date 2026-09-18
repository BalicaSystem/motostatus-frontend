import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { Button } from '#/components/ui/button'
import { OrderTable } from '#/features/orders/components/order-table'
import { useOrders } from '#/features/orders/hooks/use-orders'

export function OrdersPage() {
  const { data, isLoading, isError } = useOrders()

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Pedidos"
          description="Gerencie os pedidos de motocicletas."
          actions={
            <Button
              render={<Link to="/pedidos/novo" />}
            >
              <Plus />
              Novo pedido
            </Button>
          }
        />

        <div className="h-40 animate-pulse rounded-lg border bg-muted/30" />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader
          title="Pedidos"
          description="Gerencie os pedidos de motocicletas."
        />

        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-destructive">
            Não foi possível carregar os pedidos.
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Pedidos"
        description="Gerencie os pedidos de motocicletas."
        actions={
          <Button
            render={<Link to="/pedidos/novo" />}
          >
            <Plus />
            Novo pedido
          </Button>
        }
      />

      <OrderTable orders={data.orders} />
    </PageContainer>
  )
}