import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateOrderInput, updateOrder } from "../services/orders-service";
import type { GetOrderResponse } from "../types/order";

type UpdateOrderVariables = {
	id: string;
	data: UpdateOrderInput;
};

export function useUpdateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: UpdateOrderVariables) => updateOrder(id, data),
		onSuccess: async ({ order }) => {
			queryClient.setQueryData<GetOrderResponse>(
				["order", order.id],
				(current) => {
					if (!current) {
						return current;
					}

					return { ...current, order: { ...current.order, ...order } };
				},
			);

			await queryClient.invalidateQueries({
				queryKey: ["orders"],
			});
		},
	});
}
