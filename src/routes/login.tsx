import { createFileRoute, redirect } from "@tanstack/react-router";
import { Bike } from "lucide-react";

import { isAuthenticated } from "#/features/auth/is-authenticated";
import { LoginForm } from "#/features/auth/login-form";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const authenticated = await isAuthenticated();

		if (authenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
			<div className="w-full max-w-md space-y-8">
				<div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
					<Bike className="size-7" />
				</div>

				<LoginForm />
			</div>
		</div>
	);
}
