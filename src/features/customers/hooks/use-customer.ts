import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "../services/customers-service";

export function useCustomer(id: string) {
	return useQuery({
		queryKey: ["customer", id],
		queryFn: ({ signal }) => getCustomer(id, signal),
		enabled: Boolean(id),
	});
}
