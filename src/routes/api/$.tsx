import process from "node:process";
import { createFileRoute } from "@tanstack/react-router";

const SESSION_COOKIE_NAME = "ms.session";
const USER_COOKIE_NAME = "ms.user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getApiBaseUrl(): string {
	return process.env.MOTOSTATUS_API_URL ?? "http://localhost:3333";
}

interface LoginUser {
	id: string;
	name: string;
	email: string;
}

function parseCookies(request: Request): Record<string, string> {
	const header = request.headers.get("cookie") ?? "";

	if (!header) {
		return {};
	}

	return Object.fromEntries(
		header
			.split(";")
			.map((part) => part.trim())
			.filter(Boolean)
			.map((part) => {
				const index = part.indexOf("=");

				return [part.slice(0, index), part.slice(index + 1)];
			}),
	);
}

function cookieAttrs(maxAge: number, secure: boolean) {
	return `path=/; Max-Age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function toResponse(body: unknown, status: number, setCookies: string[]) {
	const isEmpty = status === 204 || body === null || body === undefined;
	const headers = new Headers();

	if (!isEmpty) {
		headers.set("Content-Type", "application/json");
	}

	for (const cookie of setCookies) {
		headers.append("Set-Cookie", cookie);
	}

	return new Response(isEmpty ? null : JSON.stringify(body), {
		status,
		headers,
	});
}

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			ANY: async ({ request }) => {
				const url = new URL(request.url);
				const backendPath = url.pathname;
				const cookies = parseCookies(request);
				const isSecure = url.protocol === "https:";

				if (backendPath === "/api/auth/login" && request.method === "POST") {
					const response = await fetch(`${getApiBaseUrl()}${backendPath}`, {
						method: "POST",
						headers: {
							"Content-Type":
								request.headers.get("content-type") ?? "application/json",
							accept: request.headers.get("accept") ?? "*/*",
							"accept-language": request.headers.get("accept-language") ?? "",
						},
						body: request.body,
						duplex: "half",
					} as RequestInit & { duplex: "half" });

					const payload = (await response.json().catch(() => null)) as {
						token?: string;
						user?: LoginUser;
						message?: string;
					} | null;

					if (!response.ok || !payload?.token || !payload.user) {
						return toResponse(
							{ message: payload?.message ?? "Login failed." },
							response.status,
							[],
						);
					}

					const setCookies = [
						`${SESSION_COOKIE_NAME}=${payload.token}; HttpOnly; ${cookieAttrs(COOKIE_MAX_AGE, isSecure)}`,
						`${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload.user))}; ${cookieAttrs(COOKIE_MAX_AGE, isSecure)}`,
					];

					return toResponse(
						{ user: payload.user },
						response.status,
						setCookies,
					);
				}

				if (backendPath === "/api/auth/logout" && request.method === "POST") {
					return toResponse(null, 204, [
						`${SESSION_COOKIE_NAME}=; path=/; Max-Age=0`,
						`${USER_COOKIE_NAME}=; path=/; Max-Age=0`,
					]);
				}

				const forwardedHeaders: Record<string, string> = {};

				for (const name of [
					"content-type",
					"accept",
					"content-length",
					"authorization",
				]) {
					const value = request.headers.get(name);

					if (value) {
						forwardedHeaders[name] = value;
					}
				}

				if (cookies[SESSION_COOKIE_NAME]) {
					forwardedHeaders.authorization = `Bearer ${cookies[SESSION_COOKIE_NAME]}`;
				}

				const proxied = await fetch(
					`${getApiBaseUrl()}${backendPath}${url.search}`,
					{
						method: request.method,
						headers: forwardedHeaders,
						body:
							request.method === "GET" || request.method === "HEAD"
								? undefined
								: request.body,
						redirect: "manual",
					},
				);

				const responseHeaders = new Headers(proxied.headers);

				responseHeaders.delete("set-cookie");

				return new Response(proxied.body, {
					status: proxied.status,
					headers: responseHeaders,
				});
			},
		},
	},
});
