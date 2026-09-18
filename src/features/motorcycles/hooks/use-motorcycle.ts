import { useQuery } from '@tanstack/react-query'
import { getMotorcycle } from '../services/motorcycles-service'

export function useMotorcycle(id: string) {
  return useQuery({
    queryKey: ['motorcycle', id],
    queryFn: () => getMotorcycle(id),
    enabled: Boolean(id),
  })
}