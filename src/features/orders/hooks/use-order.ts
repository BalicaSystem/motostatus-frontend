import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../services/orders-service";

export function useOrder(id: string) {
	return useQuery({
		queryKey: ["order", id],
		queryFn: ({ signal }) => getOrder(id, signal),
		enabled: Boolean(id),
	});
}
