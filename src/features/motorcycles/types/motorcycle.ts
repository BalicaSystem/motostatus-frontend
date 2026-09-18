export type MotorcycleStatus =
  | 'in-transit'
  | 'delayed'
  | 'arrived'

export type Motorcycle = {
  id: string
  model: string
  chassis: string
  estimatedArrival: string | null
  status: MotorcycleStatus
  createdAt: string
  updatedAt: string
}