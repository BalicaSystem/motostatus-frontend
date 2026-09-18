import { createFileRoute } from '@tanstack/react-router'

import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { MotorcycleEditForm } from '#/features/motorcycles/components/motorcycle-edit-form'

export const Route = createFileRoute('/motocicletas/$motorcycleId')({
  component: EditMotorcyclePage,
})

function EditMotorcyclePage() {
  const { motorcycleId } = Route.useParams()

  return (
    <PageContainer>
      <PageHeader
        title="Editar motocicleta"
        description="Atualize os dados da motocicleta."
      />

      <MotorcycleEditForm motorcycleId={motorcycleId} />
    </PageContainer>
  )
}
