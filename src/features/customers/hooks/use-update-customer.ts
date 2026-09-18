import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateCustomer,
  type UpdateCustomerInput,
} from '../services/customers-service'

type UpdateCustomerVariables = {
  id: string
  data: UpdateCustomerInput
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateCustomerVariables) =>
      updateCustomer(id, data),
    onSuccess: async ({ customer }) => {
      queryClient.setQueryData(
        ['customer', customer.id],
        { customer },
      )

      await queryClient.invalidateQueries({
        queryKey: ['customers'],
      })
    },
  })
}