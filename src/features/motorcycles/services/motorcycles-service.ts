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
	signal?: AbortSignal,
) {
	return api<GetMotorcyclesResponse>(
		`/motorcycles?page=${page}&perPage=${perPage}`,
		{ signal },
	);
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

export async function checkInMotorcycle(data: CheckInMotorcycleInput) {
	return api<{ motorcycle: Motorcycle }>("/motorcycles/check-in", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
