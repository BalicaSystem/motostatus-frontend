import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
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
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useCreateMotorcycle } from '../hooks/use-create-motorcycle'
import {
  createMotorcycleSchema,
  type CreateMotorcycleFormData,
} from '../schemas/motorcycle-schema'

export function MotorcycleForm() {
  const navigate = useNavigate()
  const createMotorcycle = useCreateMotorcycle()

  const form = useForm<CreateMotorcycleFormData>({
    resolver: zodResolver(createMotorcycleSchema),
    defaultValues: {
      model: '',
      chassis: '',
      estimatedArrival: '',
    },
  })

  async function onSubmit(data: CreateMotorcycleFormData) {
    try {
      await createMotorcycle.mutateAsync(data)

      toast.success('Motocicleta cadastrada com sucesso', {
        description: 'A motocicleta foi adicionada ao estoque.',
      })

      await navigate({
        to: '/motocicletas',
      })
    } catch (error) {
      toast.error('Não foi possível cadastrar a motocicleta', {
        description:
          error instanceof Error
            ? error.message
            : 'Verifique os dados e tente novamente.',
      })
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da motocicleta</CardTitle>
        <CardDescription>
          Informe os dados da motocicleta para adicioná-la ao estoque.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.model}>
              <FieldLabel htmlFor="model">Modelo</FieldLabel>

              <Input
                id="model"
                placeholder="Ex.: Honda CG 160"
                {...form.register('model')}
              />

              {form.formState.errors.model && (
                <FieldError>
                  {form.formState.errors.model.message}
                </FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.chassis}>
              <FieldLabel htmlFor="chassis">Chassi</FieldLabel>

              <Input
                id="chassis"
                placeholder="Informe o chassi"
                {...form.register('chassis')}
              />

              {form.formState.errors.chassis && (
                <FieldError>
                  {form.formState.errors.chassis.message}
                </FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!form.formState.errors.estimatedArrival}
            >
              <FieldLabel htmlFor="estimatedArrival">
                Previsão de chegada
              </FieldLabel>

              <Input
                id="estimatedArrival"
                type="date"
                {...form.register('estimatedArrival')}
              />

              {form.formState.errors.estimatedArrival && (
                <FieldError>
                  {form.formState.errors.estimatedArrival.message}
                </FieldError>
              )}
            </Field>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={createMotorcycle.isPending}
                onClick={() =>
                  navigate({
                    to: '/motocicletas',
                  })
                }
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={createMotorcycle.isPending}
              >
                {createMotorcycle.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar motocicleta'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}