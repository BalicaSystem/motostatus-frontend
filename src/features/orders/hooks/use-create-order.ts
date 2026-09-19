import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateOrderInput, createOrder } from "../services/orders-service";

export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateOrderInput) => createOrder(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["orders"],
			});

			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
