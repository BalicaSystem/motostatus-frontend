import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releaseOrderItem } from "../services/orders-service";
import type { GetOrderResponse } from "../types/order";

type ReleaseOrderItemVariables = {
	id: string;
	orderId: string;
};

export function useReleaseOrderItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: ReleaseOrderItemVariables) => releaseOrderItem(id),
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

			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
