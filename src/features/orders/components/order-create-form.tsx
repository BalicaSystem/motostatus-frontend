import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useCustomers } from '#/features/customers/hooks/use-customers'
import { useMotorcycles } from '#/features/motorcycles/hooks/use-motorcycles'
import { useCreateOrder } from '../hooks/use-create-order'
import {
  orderSchema,
  type OrderFormData,
} from '../schemas/order-schema'

export function OrderCreateForm() {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  const customers = useCustomers()
  const motorcycles = useMotorcycles()

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      seller: '',
      billingDate: '',
      motorcycleIds: [],
    },
  })

  const selectedMotorcycleIds = form.watch('motorcycleIds')

  function toggleMotorcycle(id: string) {
    const current = form.getValues('motorcycleIds')

    if (current.includes(id)) {
      form.setValue(
        'motorcycleIds',
        current.filter((motorcycleId) => motorcycleId !== id),
        {
          shouldValidate: true,
        },
      )

      return
    }

    form.setValue(
      'motorcycleIds',
      [...current, id],
      {
        shouldValidate: true,
      },
    )
  }

  async function onSubmit(data: OrderFormData) {
    try {
      await createOrder.mutateAsync(data)

      toast.success('Pedido criado com sucesso', {
        description: 'O pedido foi registrado.',
      })

      await navigate({ to: '/pedidos' })
    } catch (error) {
      toast.error('Não foi possível criar o pedido', {
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente.',
      })
    }
  }

  if (customers.isLoading || motorcycles.isLoading) {
    return (
      <div className="h-96 animate-pulse rounded-lg border bg-muted/30" />
    )
  }

  if (customers.isError || motorcycles.isError) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-destructive">
          Não foi possível carregar os dados do pedido.
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do pedido</CardTitle>
        <CardDescription>
          Selecione o cliente, o vendedor e as motocicletas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              data-invalid={!!form.formState.errors.customerId}
            >
              <FieldLabel htmlFor="customerId">
                Cliente
              </FieldLabel>

              <select
                id="customerId"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                {...form.register('customerId')}
              >
                <option value="">
                  Selecione o cliente
                </option>

                {customers.data.customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name} — {customer.document}
                  </option>
                ))}
              </select>

              {form.formState.errors.customerId && (
                <FieldError>
                  {form.formState.errors.customerId.message}
                </FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!form.formState.errors.seller}
            >
              <FieldLabel htmlFor="seller">
                Vendedor
              </FieldLabel>

              <Input
                id="seller"
                placeholder="Nome do vendedor"
                {...form.register('seller')}
              />

              {form.formState.errors.seller && (
                <FieldError>
                  {form.formState.errors.seller.message}
                </FieldError>
              )}
            </Field>
          </div>

          <Field
            data-invalid={!!form.formState.errors.billingDate}
          >
            <FieldLabel htmlFor="billingDate">
              Data de faturamento
            </FieldLabel>

            <Input
              id="billingDate"
              type="date"
              {...form.register('billingDate')}
            />

            {form.formState.errors.billingDate && (
              <FieldError>
                {form.formState.errors.billingDate.message}
              </FieldError>
            )}
          </Field>

          <Field
            data-invalid={!!form.formState.errors.motorcycleIds}
          >
            <FieldLabel>
              Motocicletas
            </FieldLabel>

            <div className="space-y-2 rounded-lg border p-3">
              {motorcycles.data.motorcycles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma motocicleta disponível.
                </p>
              ) : (
                motorcycles.data.motorcycles.map(
                  (motorcycle) => {
                    const checked =
                      selectedMotorcycleIds.includes(
                        motorcycle.id,
                      )

                    return (
                      <label
                        key={motorcycle.id}
                        className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleMotorcycle(motorcycle.id)
                          }
                        />

                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {motorcycle.model}
                            </p>

                            <p className="font-mono text-xs text-muted-foreground">
                              {motorcycle.chassis}
                            </p>
                          </div>

                          <span className="text-xs text-muted-foreground">
                            {motorcycle.status}
                          </span>
                        </div>
                      </label>
                    )
                  },
                )
              )}
            </div>

            {form.formState.errors.motorcycleIds && (
              <FieldError>
                {form.formState.errors.motorcycleIds.message}
              </FieldError>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={createOrder.isPending}
              onClick={() => navigate({ to: '/pedidos' })}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending
                ? 'Criando...'
                : 'Criar pedido'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}