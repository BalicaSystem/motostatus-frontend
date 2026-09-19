import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "../services/customers-service";

export function useCustomer(id: string) {
	return useQuery({
		queryKey: ["customer", id],
		queryFn: () => getCustomer(id),
		enabled: Boolean(id),
	});
}
