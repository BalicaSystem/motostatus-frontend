import { api } from "#/lib/api/client";
import { type AuthUser, clearSessionUser, setSessionUser } from "./session";

export async function authenticate(
	email: string,
	password: string,
): Promise<AuthUser> {
	const { user } = await api<{ user: AuthUser }>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	setSessionUser(user);

	return user;
}

export async function signOut() {
	try {
		await api<void>("/auth/logout", { method: "POST" });
	} finally {
		clearSessionUser();
	}
}
