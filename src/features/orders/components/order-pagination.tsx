import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '#/components/ui/button'

type OrderPaginationProps = {
  page: number
  totalPages: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
}

export function OrderPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: OrderPaginationProps) {
  if (total === 0) {
    return null
  }

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Exibindo {start}–{end} de {total} pedidos
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}