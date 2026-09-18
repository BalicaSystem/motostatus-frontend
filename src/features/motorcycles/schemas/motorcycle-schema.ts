import { z } from 'zod'

export const motorcycleSchema = z.object({
  model: z.string().min(1, 'Informe o modelo'),
  chassis: z.string().min(1, 'Informe o chassi'),
  estimatedArrival: z
    .union([z.iso.date(), z.literal('')])
    .transform((value) => (value === '' ? null : value)),
  status: z.enum(['in_transit', 'delayed', 'arrived']),
})

export type MotorcycleFormData = z.infer<typeof motorcycleSchema>
