import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateMotorcycle,
  type UpdateMotorcycleInput,
} from '../services/motorcycles-service'

type UpdateMotorcycleVariables = {
  id: string
  data: UpdateMotorcycleInput
}

export function useUpdateMotorcycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateMotorcycleVariables) =>
      updateMotorcycle(id, data),
    onSuccess: async ({ motorcycle }) => {
      queryClient.setQueryData(
        ['motorcycle', motorcycle.id],
        { motorcycle },
      )

      await queryClient.invalidateQueries({
        queryKey: ['motorcycles'],
      })
    },
  })
}