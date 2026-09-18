import { api } from '@/lib/api/client';
import type { Motorcycle } from '../types/motorcycle';

export async function getMotorcycles() {
  return api<Motorcycle[]>('/motorcycles');
}