import { Link, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { Button } from '#/components/ui/button'
import { CustomerPagination } from '#/features/customers/components/customer-pagination'
import { CustomerTable } from '#/features/customers/components/customer-table'
import { CustomerTableSkeleton } from '#/features/customers/components/customer-table-skeleton'
import { useCustomers } from '#/features/customers/hooks/use-customers'

export function CustomersPage() {
  const navigate = useNavigate()
  const search = new URLSearchParams(window.location.search)
  const page = Number(search.get('page')) || 1

  const { data, isLoading, isFetching, isError } =
    useCustomers(page)

  function handlePageChange(nextPage: number) {
    navigate({
      to: '/clientes',
      search: {
        page: nextPage,
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes da concessionária."
        actions={
          <Button
            nativeButton={false}
            render={<Link to="/clientes/novo" />}
          >
            <Plus className="size-4" />
            Novo cliente
          </Button>
        }
      />

      {isLoading && <CustomerTableSkeleton />}

      {isError && (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os clientes.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-3">
          <div className="relative">
            <CustomerTable customers={data.customers} />

            {isFetching && (
              <div className="absolute inset-0 flex items-start justify-center bg-background/40 pt-4 backdrop-blur-[1px]">
                <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
                  Atualizando...
                </div>
              </div>
            )}
          </div>

          <CustomerPagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            perPage={data.perPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </PageContainer>
  )
}