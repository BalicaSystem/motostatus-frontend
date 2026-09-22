import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "../services/orders-service";

export function useDeleteOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteOrder(id),
		onSuccess: async (_, id) => {
			queryClient.removeQueries({
				queryKey: ["order", id],
			});

			await queryClient.invalidateQueries({
				queryKey: ["orders"],
			});

			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
