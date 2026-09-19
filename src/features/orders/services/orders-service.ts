import { api } from "#/lib/api/client";
import type { GetOrderResponse, GetOrdersResponse } from "../types/order";

export type CreateOrderInput = {
	customerId: string;
	seller: string;
	billingDate?: string | null;
	motorcycleIds: string[];
};

export async function getOrders() {
	return api<GetOrdersResponse>("/orders");
}

export async function getOrder(id: string) {
	return api<GetOrderResponse>(`/orders/${id}`);
}

export async function createOrder(data: CreateOrderInput) {
	return api<GetOrderResponse>("/orders", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
