import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOrderItem } from "../services/orders-service";
import type { GetOrderResponse } from "../types/order";

type CompleteOrderItemVariables = {
	id: string;
	orderId: string;
};

export function useCompleteOrderItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: CompleteOrderItemVariables) => completeOrderItem(id),
		onSuccess: async ({ orderItem }, { orderId }) => {
			queryClient.setQueryData<GetOrderResponse>(
				["order", orderId],
				(current) => {
					if (!current) {
						return current;
					}

					return {
						...current,
						orderItems: current.orderItems.map((item) =>
							item.id === orderItem.id ? { ...item, ...orderItem } : item,
						),
					};
				},
			);
		},
	});
}
