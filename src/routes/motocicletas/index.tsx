import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, QrCode } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { MotorcyclePagination } from "#/features/motorcycles/components/motorcycle-pagination";
import { MotorcycleTable } from "#/features/motorcycles/components/motorcycle-table";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";
import { MotorcycleTableSkeleton } from "#/features/motorcycles/components/motorcycle-table-skeleton";

export const Route = createFileRoute("/motocicletas/")({
	validateSearch: (search) => ({
		page: Number(search.page) || 1,
	}),
	component: MotorcyclesPage,
});

function MotorcyclesPage() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()
  const { data, isLoading, isFetching, isError } =
    useMotorcycles(page)

  function handlePageChange(nextPage: number) {
    navigate({
      to: "/motocicletas",
      search: {
        page: nextPage,
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Motocicletas"
        description="Gerencie as motocicletas da concessionária."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link to="/motocicletas/registrar-chegada" />
              }
            >
              <QrCode className="size-4" />
              Registrar chegada
            </Button>

            <Button
              nativeButton={false}
              render={<Link to="/motocicletas/nova" />}
            >
              <Plus className="size-4" />
              Nova motocicleta
            </Button>
          </div>
        }
      />

      {isLoading && <MotorcycleTableSkeleton />}

      {isError && (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as motocicletas.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-3">
          <div className="relative">
            <MotorcycleTable motorcycles={data.motorcycles} />

            {isFetching && (
              <div className="absolute inset-0 flex items-start justify-center bg-background/40 pt-4 backdrop-blur-[1px]">
                <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
                  Atualizando...
                </div>
              </div>
            )}
          </div>

          <MotorcyclePagination
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
