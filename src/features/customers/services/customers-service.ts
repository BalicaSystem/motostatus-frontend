import { api } from "#/lib/api/client";
import type { Customer } from "../types/customer";

export type GetCustomersResponse = {
	customers: Customer[];
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
};

export type GetCustomerResponse = {
	customer: Customer;
};

export type CreateCustomerInput = {
	name: string;
	document: string;
	city: string;
};

export type UpdateCustomerInput = {
	name?: string;
	document?: string;
	city?: string;
};

export async function getCustomers() {
	return api<GetCustomersResponse>("/customers");
}

export async function getCustomer(id: string) {
	return api<GetCustomerResponse>(`/customers/${id}`);
}

export async function createCustomer(data: CreateCustomerInput) {
	return api<{ customer: Customer }>("/customers", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
	return api<{ customer: Customer }>(`/customers/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}
