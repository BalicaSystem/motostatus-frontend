import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppLayout } from "#/components/layout/app-layout";
import { isAuthenticated } from "#/features/auth/is-authenticated";

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		const authenticated = await isAuthenticated();

		if (!authenticated) {
			throw redirect({ to: "/login" });
		}
	},
	component: AppRoute,
});

function AppRoute() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
