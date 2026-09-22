import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orders-service";

export function useOrders(page = 1) {
	return useQuery({
		queryKey: ["orders", page],
		queryFn: ({ signal }) => getOrders(page, 20, signal),
		placeholderData: (previousData) => previousData,
	});
}
