import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type CreateCustomerInput,
	createCustomer,
} from "../services/customers-service";

export function useCreateCustomer() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCustomerInput) => createCustomer(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["customers"],
			});
		},
	});
}
