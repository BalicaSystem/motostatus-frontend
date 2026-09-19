import { createFileRoute } from '@tanstack/react-router'

import { OrdersPage } from './pedidos'

export const Route = createFileRoute('/pedidos/')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
  }),
  component: OrdersPage,
})