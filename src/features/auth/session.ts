import { useSyncExternalStore } from "react";

export const SESSION_COOKIE_NAME = "ms.session";
export const USER_COOKIE_NAME = "ms.user";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface AuthUser {
	id: string;
	name: string;
	email: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();

function parseAuthUser(rawValue: string): AuthUser | null {
	try {
		return JSON.parse(decodeURIComponent(rawValue)) as AuthUser;
	} catch {
		return null;
	}
}

let cachedCookieValue: string | null | undefined;
let cachedUser: AuthUser | null = null;

function getUserCookieValue(): string | null {
	if (typeof document === "undefined") {
		return null;
	}

	const cookie = document.cookie
		.split("; ")
		.find((entry) => entry.startsWith(`${USER_COOKIE_NAME}=`));

	return cookie ? cookie.slice(USER_COOKIE_NAME.length + 1) : null;
}

export function getSessionUser(): AuthUser | null {
	const value = getUserCookieValue();

	if (value === cachedCookieValue) {
		return cachedUser;
	}

	cachedCookieValue = value;
	cachedUser = value ? parseAuthUser(value) : null;

	return cachedUser;
}

export function setSessionUser(user: AuthUser) {
	document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;

	emitChange();
}

export function clearSessionUser() {
	document.cookie = `${USER_COOKIE_NAME}=; path=/; max-age=0`;

	emitChange();
}

function emitChange() {
	for (const listener of listeners) {
		listener();
	}
}

function subscribe(listener: Listener) {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}

export function useSessionUser(): AuthUser | null {
	return useSyncExternalStore(subscribe, getSessionUser, () => null);
}
