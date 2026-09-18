import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { CustomerCreateForm } from '#/features/customers/components/customer-create-form'

export const Route = createFileRoute('/clientes/novo')({
  component: NewCustomerPage,
})

function NewCustomerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Novo cliente"
        description="Cadastre um novo cliente."
      />

      <CustomerCreateForm />
    </PageContainer>
  )
}