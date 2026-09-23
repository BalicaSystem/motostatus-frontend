import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/customers-service";

export function customersQueryKey(page: number, q: string) {
	return ["customers", page, q] as const;
}

export function useCustomers(page = 1, q = "") {
	return useQuery({
		queryKey: customersQueryKey(page, q),
		queryFn: ({ signal }) => getCustomers(page, 20, q || undefined, signal),
		placeholderData: (previousData) => previousData,
	});
}
