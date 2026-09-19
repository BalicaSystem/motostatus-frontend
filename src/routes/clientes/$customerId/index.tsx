import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Pencil } from 'lucide-react'

import { PageContainer } from '#/components/layout/page-container'
import { PageHeader } from '#/components/layout/page-header'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Skeleton } from '#/components/ui/skeleton'
import { useCustomer } from '#/features/customers/hooks/use-customer'
import { formatDateTime } from '#/lib/formatDateTime'

export const Route = createFileRoute('/clientes/$customerId/')({
  component: CustomerDetailsPage,
})

function CustomerDetailsPage() {
  const { customerId } = Route.useParams()
  const { data, isLoading, isError } = useCustomer(customerId)

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Cliente"
          description="Visualização dos dados do cliente."
        />

        <CustomerDetailsSkeleton />
      </PageContainer>
    )
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <PageHeader
          title="Cliente"
          description="Visualização dos dados do cliente."
        />

        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o cliente.
          </p>
        </div>
      </PageContainer>
    )
  }

  const { customer } = data

  return (
    <PageContainer>
      <PageHeader
        title={customer.name}
        description="Visualização dos dados do cliente."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link
                  to="/clientes/$customerId"
                  params={{ customerId: customer.id }}
                />
              }
            >
              <Pencil className="size-4" />
              Editar
            </Button>

            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to="/clientes" search={{ page: 1 }} />}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados do cliente</CardTitle>
            <CardDescription>
              Informações cadastradas do cliente.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Nome
              </p>
              <p className="font-medium">{customer.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                CPF/CNPJ
              </p>
              <p className="font-mono text-sm">
                {customer.document}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Cidade
              </p>
              <p className="font-medium">{customer.city}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">
                Cadastrado em
              </p>
              <p className="font-medium">
                {formatDateTime(customer.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Última atualização
              </p>
              <p className="font-medium">
                {formatDateTime(customer.updatedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
            <CardDescription>
              Identificador interno do cliente.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">
                ID do cliente
              </p>
              <p className="break-all font-mono text-xs">
                {customer.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

function CustomerDetailsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>

        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}