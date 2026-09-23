import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ArrowLeft } from "lucide-react";
import { Providers } from "#/components/providers";
import { Button } from "#/components/ui/button";
import { Toaster } from "#/components/ui/sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Status Moto",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: RootNotFound,
	shellComponent: RootDocument,
});

function RootNotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
			<p className="text-6xl font-semibold">404</p>

			<h1 className="text-2xl font-semibold tracking-tight">
				Página não encontrada
			</h1>

			<p className="text-sm text-muted-foreground">
				A página que você procura não existe ou foi movida.
			</p>

			<Button variant="outline" nativeButton={false} render={<Link to="/" />}>
				<ArrowLeft className="size-4" />
				Voltar ao início
			</Button>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>

			<body>
				<Providers>
					{children}
					<Toaster />
				</Providers>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>

				<Scripts />
			</body>
		</html>
	);
}
