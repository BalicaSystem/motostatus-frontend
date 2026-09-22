import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

import { openCommandMenu } from "#/components/command-menu";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { SidebarTrigger } from "#/components/ui/sidebar";

type Crumb = {
	label: string;
	to?: string;
};

const rootCrumbs: Record<string, Crumb[]> = {
	"/dashboard": [{ label: "Dashboard" }],
	"/clientes": [{ label: "Clientes" }],
	"/clientes/novo": [
		{ label: "Clientes", to: "/clientes" },
		{ label: "Novo cliente" },
	],
	"/motocicletas": [{ label: "Motocicletas" }],
	"/motocicletas/nova": [
		{ label: "Motocicletas", to: "/motocicletas" },
		{ label: "Nova motocicleta" },
	],
	"/motocicletas/registrar-chegada": [
		{ label: "Motocicletas", to: "/motocicletas" },
		{ label: "Registrar chegada" },
	],
	"/pedidos": [{ label: "Pedidos" }],
	"/pedidos/novo": [
		{ label: "Pedidos", to: "/pedidos" },
		{ label: "Novo pedido" },
	],
};

function useBreadcrumbs(): Crumb[] {
	const { pathname } = useLocation();

	return useMemo(
		() => rootCrumbs[pathname] ?? [{ label: "Painel" }],
		[pathname],
	);
}

export function AppHeader() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const crumbs = useBreadcrumbs();

	useEffect(() => {
		setMounted(true);
	}, []);

	function toggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger
				render={<Button variant="ghost" size="icon" className="size-8" />}
			>
				<Menu className="size-4" />
				<span className="sr-only">Abrir menu</span>
			</SidebarTrigger>

			<Separator orientation="vertical" className="h-5" />

			<Breadcrumb>
				<BreadcrumbList>
					{crumbs.map((crumb, index) => (
						<BreadcrumbItem key={crumb.to ?? `${crumb.label}-${index}`}>
							{index > 0 && <BreadcrumbSeparator />}

							{index === crumbs.length - 1 ? (
								<BreadcrumbPage className="font-display text-xs font-semibold tracking-[0.06em] uppercase">
									{crumb.label}
								</BreadcrumbPage>
							) : crumb.to ? (
								<BreadcrumbLink
									className="font-display text-xs font-semibold tracking-[0.06em] uppercase"
									render={<Link to={crumb.to as never} />}
								>
									{crumb.label}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="font-display text-xs font-semibold tracking-[0.06em] uppercase">
									{crumb.label}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="ml-auto flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					className="hidden h-8 w-48 justify-start gap-2 px-3 text-sm font-normal text-muted-foreground lg:inline-flex"
					onClick={openCommandMenu}
				>
					<Search className="size-3.5" />
					<span className="flex-1 text-left">Buscar...</span>

					<kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
						⌘K
					</kbd>
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="size-8"
					disabled={!mounted}
					aria-label="Alternar tema"
					onClick={toggleTheme}
				>
					{mounted && resolvedTheme === "dark" ? (
						<Sun className="size-4" />
					) : (
						<Moon className="size-4" />
					)}
				</Button>
			</div>
		</header>
	);
}
