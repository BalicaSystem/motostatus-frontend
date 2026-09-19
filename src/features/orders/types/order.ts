import type { Customer } from "#/features/customers/types/customer";
import type { Motorcycle } from "#/features/motorcycles/types/motorcycle";

export type OrderStatus = "active" | "cancelled";

export type RegistrationStatus =
	| "without_registration"
	| "registering"
	| "registered";

export type Order = {
	id: string;
	customerId: string;
	seller: string;
	billingDate: string | null;
	createdAt: string;
	updatedAt: string;
};

export type OrderItem = {
	id: string;
	orderId: string;
	motorcycleId: string;
	status: OrderStatus;
	registrationStatus: RegistrationStatus;
	registrationDate: string | null;
	createdAt: string;
	updatedAt: string;
};

export type OrderListItem = {
	id: string;
	seller: string;
	billingDate: string | null;
	createdAt: string;
	customer: {
		id: string;
		name: string;
		document: string;
	};
	motorcycles: {
		id: string;
		model: string;
		chassis: string;
	}[];
};

export type OrderWithDetails = Order & {
	customer: Customer;
};

export type OrderItemWithMotorcycle = OrderItem & {
	motorcycle: Motorcycle;
};

export type GetOrdersResponse = {
	orders: OrderListItem[];
	meta: {
		page: number;
		perPage: number;
		total: number;
		totalPages: number;
	};
};

export type GetOrderResponse = {
	order: OrderWithDetails;
	orderItems: OrderItemWithMotorcycle[];
};
