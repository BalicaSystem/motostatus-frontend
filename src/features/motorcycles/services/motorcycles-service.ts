import { api } from '#/lib/api/client'
import type { Motorcycle } from '../types/motorcycle'

export type GetMotorcyclesResponse = {
  motorcycles: Motorcycle[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type CreateMotorcycleInput = {
  model: string
  chassis: string
  estimatedArrival?: string
}

export async function getMotorcycles() {
  return api<GetMotorcyclesResponse>('/motorcycles')
}

export async function createMotorcycle(data: CreateMotorcycleInput) {
  return api<Motorcycle>('/motorcycles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}