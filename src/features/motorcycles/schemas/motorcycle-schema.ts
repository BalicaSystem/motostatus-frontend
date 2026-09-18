import { z } from 'zod'

export const createMotorcycleSchema = z.object({
  model: z.string().min(1, 'Informe o modelo'),
  chassis: z.string().min(1, 'Informe o chassi'),
  estimatedArrival: z
    .union([z.iso.date(), z.literal('')])
    .transform((value) => (value === '' ? undefined : value)),
})

export const updateMotorcycleSchema = z.object({
  model: z.string().min(1, 'Informe o modelo'),
  chassis: z.string().min(1, 'Informe o chassi'),
  estimatedArrival: z
    .union([z.iso.date(), z.literal('')])
    .transform((value) => (value === '' ? null : value)),
  status: z.enum(['in_transit', 'delayed', 'arrived']),
})

export type CreateMotorcycleFormData = z.infer<
  typeof createMotorcycleSchema
>

export type UpdateMotorcycleFormData = z.infer<
  typeof updateMotorcycleSchema
>