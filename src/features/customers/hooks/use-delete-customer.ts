import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../services/customers-service";

export function useDeleteCustomer() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteCustomer(id),
		onSuccess: async (_, id) => {
			queryClient.removeQueries({
				queryKey: ["customer", id],
			});

			await queryClient.invalidateQueries({
				queryKey: ["customers"],
			});
		},
	});
}
