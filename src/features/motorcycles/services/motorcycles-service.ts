import { api } from "#/lib/api/client";
import type { Motorcycle } from "../types/motorcycle";

export type GetMotorcyclesResponse = {
	motorcycles: Motorcycle[];
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
};

export type GetMotorcycleResponse = {
	motorcycle: Motorcycle;
};

export type CreateMotorcycleInput = {
	model: string;
	chassis: string;
	estimatedArrival?: string;
};

export type UpdateMotorcycleInput = {
	model?: string;
	chassis?: string;
	estimatedArrival?: string | null;
	status?: Motorcycle["status"];
};

export type CheckInMotorcycleInput = {
	chassis: string;
};

export async function getMotorcycles(
	page = 1,
	perPage = 20,
	q?: string,
	status?: Motorcycle["status"],
	signal?: AbortSignal,
) {
	const params = new URLSearchParams({
		page: String(page),
		perPage: String(perPage),
	});

	if (q) {
		params.set("q", q);
	}

	if (status) {
		params.set("status", status);
	}

	return api<GetMotorcyclesResponse>(`/motorcycles?${params.toString()}`, {
		signal,
	});
}

export async function getMotorcycle(id: string, signal?: AbortSignal) {
	return api<GetMotorcycleResponse>(`/motorcycles/${id}`, { signal });
}

export async function createMotorcycle(data: CreateMotorcycleInput) {
	return api<{ motorcycle: Motorcycle }>("/motorcycles", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateMotorcycle(
	id: string,
	data: UpdateMotorcycleInput,
) {
	return api<{ motorcycle: Motorcycle }>(`/motorcycles/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteMotorcycle(id: string) {
	return api<void>(`/motorcycles/${id}`, {
		method: "DELETE",
	});
}

export async function checkInMotorcycle(data: CheckInMotorcycleInput) {
	return api<{ motorcycle: Motorcycle }>("/motorcycles/check-in", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
