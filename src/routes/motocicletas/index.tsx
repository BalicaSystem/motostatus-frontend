import { createFileRoute, Link } from '@tanstack/react-router'

import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { useMotorcycles } from '#/features/motorcycles/hooks/use-motorcycles'
import { MotorcycleTable } from '#/features/motorcycles/components/motorcycle-table'
import { Button, buttonVariants } from '#/components/ui/button'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/motocicletas/')({
  component: MotorcyclesPage,
})

function MotorcyclesPage() {
  const { data, isLoading, isError } = useMotorcycles()

  return (
    <PageContainer>
      <PageHeader
        title="Motocicletas"
        description="Gerencie as motocicletas da concessionária."
        actions={
          <Link
            to="/motocicletas/nova"
            className={buttonVariants()}
          >
            <Plus />
            Nova motocicleta
          </Link>
        }
      />

      {isLoading && <div>Carregando motocicletas...</div>}

      {isError && (
        <div>Não foi possível carregar as motocicletas.</div>
      )}

      {data && <MotorcycleTable motorcycles={data.motorcycles} />}
    </PageContainer>
  )
}