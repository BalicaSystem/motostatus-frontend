import { useQuery } from "@tanstack/react-query";
import { getMotorcycles } from "../services/motorcycles-service";
import type { Motorcycle } from "../types/motorcycle";

export function motorcyclesQueryKey(
	page: number,
	q: string,
	status?: Motorcycle["status"],
) {
	return ["motorcycles", page, q, status] as const;
}

export function useMotorcycles(
	page = 1,
	q = "",
	status?: Motorcycle["status"],
) {
	return useQuery({
		queryKey: motorcyclesQueryKey(page, q, status),
		queryFn: ({ signal }) =>
			getMotorcycles(page, 20, q || undefined, status ?? undefined, signal),
		placeholderData: (previousData) => previousData,
	});
}
