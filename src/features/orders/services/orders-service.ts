import { api } from "#/lib/api/client";
import type {
	GetOrderResponse,
	GetOrdersResponse,
	Order,
	OrderItem,
	RegistrationStatus,
} from "../types/order";

export type CreateOrderInput = {
	customerId: string;
	seller: string;
	billingDate?: string | null;
	motorcycleIds: string[];
};

export type UpdateOrderInput = {
	seller?: string;
	billingDate?: string | null;
};

export type UpdateOrderItemInput = {
	registrationStatus?: RegistrationStatus;
	registrationDate?: string | null;
};

export async function getOrders(page = 1, perPage = 20, signal?: AbortSignal) {
	return api<GetOrdersResponse>(`/orders?page=${page}&perPage=${perPage}`, {
		signal,
	});
}

export async function getOrder(id: string, signal?: AbortSignal) {
	return api<GetOrderResponse>(`/orders/${id}`, { signal });
}

export async function createOrder(data: CreateOrderInput) {
	return api<GetOrderResponse>("/orders", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateOrder(id: string, data: UpdateOrderInput) {
	return api<{ order: Order }>(`/orders/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteOrder(id: string) {
	return api<void>(`/orders/${id}`, {
		method: "DELETE",
	});
}

export async function updateOrderItem(id: string, data: UpdateOrderItemInput) {
	return api<{ orderItem: OrderItem }>(`/orders/items/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function releaseOrderItem(id: string) {
	return api<{ orderItem: OrderItem }>(`/orders/items/${id}/release`, {
		method: "POST",
	});
}

export async function completeOrderItem(id: string) {
	return api<{ orderItem: OrderItem }>(`/orders/items/${id}/complete`, {
		method: "POST",
	});
}
