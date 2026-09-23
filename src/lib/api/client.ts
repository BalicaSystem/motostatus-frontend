import { clearSessionUser } from "#/features/auth/session";

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
	const headers = new Headers(options?.headers);

	if (options?.body) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`/api${path}`, {
		...options,
		signal: options?.signal,
		headers,
	});

	if (!response.ok) {
		const contentType = response.headers.get("content-type");

		if (response.status === 401 && !path.startsWith("/auth/")) {
			clearSessionUser();

			if (typeof window !== "undefined") {
				window.location.assign("/login");
			}
		}

		if (contentType?.includes("application/json")) {
			const error = await response.json();

			throw new ApiError(
				response.status,
				error.message ?? `API error: ${response.status}`,
			);
		}

		throw new ApiError(response.status, `API error: ${response.status}`);
	}

	const contentType = response.headers.get("content-type");

	if (response.status === 204 || !contentType?.includes("application/json")) {
		return undefined as T;
	}

	return response.json();
}
