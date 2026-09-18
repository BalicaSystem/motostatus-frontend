import { z } from 'zod'

export const motorcycleSchema = z.object({
  model: z.string().min(1, 'Informe o modelo'),
  chassis: z.string().min(1, 'Informe o chassi'),
  estimatedArrival: z.iso.date().optional(),
})

export type MotorcycleFormData = z.infer<typeof motorcycleSchema>