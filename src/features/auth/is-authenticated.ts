import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { SESSION_COOKIE_NAME } from "./session";

export const isAuthenticated = createServerFn({ method: "GET" }).handler(() => {
	return Boolean(getCookie(SESSION_COOKIE_NAME));
});
