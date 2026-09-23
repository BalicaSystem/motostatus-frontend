import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orders-service";

export function ordersQueryKey(page: number, q: string) {
	return ["orders", page, q] as const;
}

export function useOrders(page = 1, q = "") {
	return useQuery({
		queryKey: ordersQueryKey(page, q),
		queryFn: ({ signal }) => getOrders(page, 20, q || undefined, signal),
		placeholderData: (previousData) => previousData,
	});
}
