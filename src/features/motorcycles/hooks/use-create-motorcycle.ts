import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMotorcycle,
  type CreateMotorcycleInput,
} from '../services/motorcycles-service'

export function useCreateMotorcycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMotorcycleInput) => createMotorcycle(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['motorcycles'],
      })
    },
  })
}