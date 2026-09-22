import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type UpdateOrderItemInput,
	updateOrderItem,
} from "../services/orders-service";
import type { GetOrderResponse } from "../types/order";

type UpdateOrderItemVariables = {
	id: string;
	orderId: string;
	data: UpdateOrderItemInput;
};

export function useUpdateOrderItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: UpdateOrderItemVariables) =>
			updateOrderItem(id, data),
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
