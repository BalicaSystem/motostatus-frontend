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
import {
  customerSchema,
  type CustomerFormData,
} from '../schemas/customer-schema'
import { useCreateCustomer } from '../hooks/use-create-customer'

export function CustomerCreateForm() {
  const navigate = useNavigate()
  const createCustomer = useCreateCustomer()

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      document: '',
      city: '',
    },
  })

  async function onSubmit(data: CustomerFormData) {
    try {
      await createCustomer.mutateAsync(data)

      toast.success('Cliente cadastrado com sucesso', {
        description: 'O cliente foi adicionado ao sistema.',
      })

      await navigate({ to: '/clientes' })
    } catch (error) {
      toast.error('Não foi possível cadastrar o cliente', {
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do cliente</CardTitle>
        <CardDescription>
          Informe os dados básicos do cliente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              data-invalid={!!form.formState.errors.name}
            >
              <FieldLabel htmlFor="name">
                Nome
              </FieldLabel>

              <Input
                id="name"
                placeholder="Nome completo"
                {...form.register('name')}
              />

              {form.formState.errors.name && (
                <FieldError>
                  {form.formState.errors.name.message}
                </FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!form.formState.errors.document}
            >
              <FieldLabel htmlFor="document">
                CPF ou CNPJ
              </FieldLabel>

              <Input
                id="document"
                placeholder="CPF ou CNPJ"
                {...form.register('document')}
              />

              {form.formState.errors.document && (
                <FieldError>
                  {form.formState.errors.document.message}
                </FieldError>
              )}
            </Field>
          </div>

          <Field
            data-invalid={!!form.formState.errors.city}
          >
            <FieldLabel htmlFor="city">
              Cidade
            </FieldLabel>

            <Input
              id="city"
              placeholder="Cidade"
              {...form.register('city')}
            />

            {form.formState.errors.city && (
              <FieldError>
                {form.formState.errors.city.message}
              </FieldError>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/clientes' })}
              disabled={createCustomer.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={createCustomer.isPending}
            >
              {createCustomer.isPending
                ? 'Cadastrando...'
                : 'Cadastrar cliente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}