import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useUpdateMotorcycle } from '../hooks/use-update-motorcycle'
import {
  motorcycleSchema,
  type MotorcycleFormData,
} from '../schemas/motorcycle-schema'
import { useMotorcycle } from '../hooks/use-motorcycle'

type MotorcycleEditFormProps = {
  motorcycleId: string
}

export function MotorcycleEditForm({
  motorcycleId,
}: MotorcycleEditFormProps) {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useMotorcycle(motorcycleId)
  const updateMotorcycle = useUpdateMotorcycle()

  const form = useForm<MotorcycleFormData>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      model: '',
      chassis: '',
      estimatedArrival: '',
      status: 'in_transit',
    },
  })

  useEffect(() => {
    if (!data?.motorcycle) {
      return
    }

    const motorcycle = data.motorcycle

    form.reset({
      model: motorcycle.model,
      chassis: motorcycle.chassis,
      estimatedArrival: motorcycle.estimatedArrival ?? '',
      status: motorcycle.status,
    })
  }, [data, form])

  async function onSubmit(values: MotorcycleFormData) {
    try {
      await updateMotorcycle.mutateAsync({
        id: motorcycleId,
        data: {
          model: values.model,
          chassis: values.chassis,
          estimatedArrival: values.estimatedArrival,
          status: values.status,
        },
      })

      toast.success('Motocicleta atualizada com sucesso', {
        description: 'As alterações foram salvas.',
      })

      await navigate({
        to: '/motocicletas',
      })
    } catch (error) {
      toast.error('Não foi possível atualizar a motocicleta', {
        description:
          error instanceof Error
            ? error.message
            : 'Verifique os dados e tente novamente.',
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data?.motorcycle) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a motocicleta.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da motocicleta</CardTitle>
        <CardDescription>
          Altere os dados da motocicleta e salve as alterações.
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

            <Field data-invalid={!!form.formState.errors.status}>
              <FieldLabel>Status</FieldLabel>

              <Select
  value={form.watch('status')}
  onValueChange={(value) =>
    form.setValue(
      'status',
      value as MotorcycleFormData['status'],
      {
        shouldValidate: true,
      },
    )
  }
>
  <SelectTrigger>
    <SelectValue>
      {{
        in_transit: 'Em trânsito',
        delayed: 'Atrasada',
        arrived: 'Chegou',
      }[form.watch('status')]}
    </SelectValue>
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="in_transit">
      Em trânsito
    </SelectItem>

    <SelectItem value="delayed">
      Atrasada
    </SelectItem>

    <SelectItem value="arrived">
      Chegou
    </SelectItem>
  </SelectContent>
</Select>

              {form.formState.errors.status && (
                <FieldError>
                  {form.formState.errors.status.message}
                </FieldError>
              )}
            </Field>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={updateMotorcycle.isPending}
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
                disabled={updateMotorcycle.isPending}
              >
                {updateMotorcycle.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
