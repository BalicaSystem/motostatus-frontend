import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../services/customers-service'

export function useCustomers(page = 1) {
  return useQuery({
    queryKey: ['customers', page],
    queryFn: () => getCustomers(page),
    placeholderData: (previousData) => previousData,
  })
}