import { useQuery } from '@tanstack/react-query';
import { getMotorcycles } from '../services/motorcycles-service';

export function useMotorcycles() {
  return useQuery({
    queryKey: ['motorcycles'],
    queryFn: getMotorcycles,
  });
}