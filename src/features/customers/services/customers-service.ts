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

export async function getCustomers(
	page = 1,
	perPage = 20,
	signal?: AbortSignal,
) {
	return api<GetCustomersResponse>(`/customers?page=${page}&perPage=${perPage}`, {
		signal,
	});
}

export async function getCustomer(id: string, signal?: AbortSignal) {
	return api<GetCustomerResponse>(`/customers/${id}`, { signal });
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

export async function deleteCustomer(id: string) {
	return api<void>(`/customers/${id}`, {
		method: "DELETE",
	});
}
