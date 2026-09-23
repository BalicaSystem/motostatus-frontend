import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import {
	Bike,
	ClipboardList,
	LayoutDashboard,
	Plus,
	QrCode,
	Search,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { openCreateDrawer } from "#/components/create-drawers";
import { Badge } from "#/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { customersQueryKey } from "#/features/customers/hooks/use-customers";
import { motorcyclesQueryKey } from "#/features/motorcycles/hooks/use-motorcycles";
import { ordersQueryKey } from "#/features/orders/hooks/use-orders";
import { queryClient } from "#/lib/api/query-client";

const OPEN_EVENT = "motostatus:open-command";

export function openCommandMenu() {
	window.dispatchEvent(new Event(OPEN_EVENT));
}

type CommandItem = {
	id: string;
	label: string;
	description?: string;
	group: string;
	icon: LucideIcon;
	to: string;
	params?: Record<string, string>;
	search?: Record<string, unknown>;
	keys?: string[];
	action?: () => void;
};

const staticCommands: CommandItem[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		group: "Páginas",
		icon: LayoutDashboard,
		to: "/dashboard",
		keys: ["inicio", "início", "home"],
	},
	{
		id: "clientes",
		label: "Clientes",
		group: "Páginas",
		icon: Users,
		to: "/clientes",
		keys: ["pessoas", "cadastro"],
	},
	{
		id: "motocicletas",
		label: "Motocicletas",
		group: "Páginas",
		icon: Bike,
		to: "/motocicletas",
		keys: ["motos", "bikes"],
	},
	{
		id: "pedidos",
		label: "Pedidos",
		group: "Páginas",
		icon: ClipboardList,
		to: "/pedidos",
		keys: ["ordens", "vendas"],
	},
	{
		id: "novo-cliente",
		label: "Novo cliente",
		group: "Ações",
		icon: Plus,
		to: "",
		action: () => openCreateDrawer("cliente"),
	},
	{
		id: "nova-motocicleta",
		label: "Nova motocicleta",
		group: "Ações",
		icon: Plus,
		to: "",
		action: () => openCreateDrawer("motocicleta"),
	},
	{
		id: "registrar-chegada",
		label: "Registrar chegada",
		group: "Ações",
		icon: QrCode,
		to: "/motocicletas/registrar-chegada",
		keys: ["qr", "checkin", "check-in"],
	},
	{
		id: "novo-pedido",
		label: "Novo pedido",
		group: "Ações",
		icon: Plus,
		to: "",
		action: () => openCreateDrawer("pedido"),
	},
];

function getRecentCommands(): CommandItem[] {
	const customers = queryClient.getQueryData<{
		customers: { id: string; name: string }[];
	}>(customersQueryKey(1, ""));

	const motorcycles = queryClient.getQueryData<{
		motorcycles: { id: string; model: string }[];
	}>(motorcyclesQueryKey(1, ""));

	const orders = queryClient.getQueryData<{
		orders: { id: string; customer: { name: string } }[];
	}>(ordersQueryKey(1, ""));

	const items: CommandItem[] = [];

	for (const customer of customers?.customers?.slice(0, 2) ?? []) {
		items.push({
			id: `customer-${customer.id}`,
			label: customer.name,
			description: "Cliente",
			group: "Registros recentes",
			icon: Users,
			to: "/clientes",
		});
	}

	for (const motorcycle of motorcycles?.motorcycles?.slice(0, 2) ?? []) {
		items.push({
			id: `motorcycle-${motorcycle.id}`,
			label: motorcycle.model,
			description: "Motocicleta",
			group: "Registros recentes",
			icon: Bike,
			to: "/motocicletas",
		});
	}

	for (const order of orders?.orders?.slice(0, 2) ?? []) {
		items.push({
			id: `order-${order.id}`,
			label: order.customer.name,
			description: `Pedido ${order.id.slice(0, 8).toUpperCase()}`,
			group: "Registros recentes",
			icon: ClipboardList,
			to: "/pedidos",
		});
	}

	return items;
}

function matches(item: CommandItem, query: string) {
	const haystack = [
		item.label,
		item.description,
		item.group,
		...(item.keys ?? []),
	]
		.join(" ")
		.toLocaleLowerCase("pt-BR");

	return haystack.includes(query);
}

export function CommandMenu() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

	const commands = useMemo(
		() => [...staticCommands, ...getRecentCommands()],
		[],
	);

	const filtered = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase("pt-BR");

		if (!normalized) {
			return commands;
		}

		return commands.filter((item) => matches(item, normalized));
	}, [commands, query]);

	const grouped = useMemo(() => {
		const groups = new Map<string, CommandItem[]>();

		for (const item of filtered) {
			const list = groups.get(item.group) ?? [];
			list.push(item);
			groups.set(item.group, list);
		}

		return [...groups.entries()];
	}, [filtered]);

	const openMenu = useCallback(() => {
		setQuery("");
		setActiveIndex(0);
		setOpen(true);
	}, []);

	const closeMenu = useCallback(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				openMenu();
			}
		}

		function onOpenCommand() {
			openMenu();
		}

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener(OPEN_EVENT, onOpenCommand);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener(OPEN_EVENT, onOpenCommand);
		};
	}, [openMenu]);

	useEffect(() => {
		if (!open) {
			return;
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setActiveIndex((index) => (index + 1) % filtered.length);
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setActiveIndex(
					(index) => (index - 1 + filtered.length) % filtered.length,
				);
			} else if (event.key === "Enter") {
				event.preventDefault();
				const item = filtered[activeIndex];

				if (item) {
					linkRefs.current.get(item.id)?.click();
				}
			}
		}

		window.addEventListener("keydown", onKeyDown, true);

		return () => window.removeEventListener("keydown", onKeyDown, true);
	}, [open, activeIndex, filtered]);

	useEffect(() => {
		const el = linkRefs.current.get(filtered[activeIndex]?.id ?? "");

		el?.scrollIntoView({ block: "nearest" });
	}, [activeIndex, filtered]);

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => (next ? openMenu() : closeMenu())}
		>
			<DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
				<DialogHeader className="border-b px-4 py-3">
					<DialogTitle>Buscar</DialogTitle>
					<DialogDescription>
						Comandos, páginas e registros recentes.
					</DialogDescription>
				</DialogHeader>

				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						autoFocus
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
						}}
						placeholder="Buscar página, ação ou registro..."
						className="h-12 rounded-none border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
					/>
				</div>

				<div className="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
					{grouped.length === 0 && (
						<div className="px-3 py-10 text-center text-sm text-muted-foreground">
							Nenhum resultado para
							<span className="font-medium text-foreground"> “{query}”.</span>
						</div>
					)}

					{grouped.map(([group, items], groupIndex) => (
						<div key={group} className="mb-2 last:mb-0">
							<p className="px-3 pt-2 pb-1.5 text-xs font-medium text-muted-foreground">
								{group}
							</p>

							{items.map((item, itemIndex) => {
								const flatIndex =
									grouped
										.slice(0, groupIndex)
										.reduce((acc, [, list]) => acc + list.length, 0) +
									itemIndex;
								const isActive = flatIndex === activeIndex;

								return (
									<Link
										key={item.id}
										to={item.to as never}
										params={item.params as never}
										search={item.search as never}
										ref={(node) => {
											if (node) {
												linkRefs.current.set(item.id, node);
											} else {
												linkRefs.current.delete(item.id);
											}
										}}
										onClick={(event) => {
											if (item.action) {
												event.preventDefault();
												item.action();
											}
											closeMenu();
										}}
										onMouseEnter={() => setActiveIndex(flatIndex)}
										className={cn(
											"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
											isActive && "bg-accent",
										)}
									>
										<span
											className={cn(
												"flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground",
												isActive && "bg-background text-foreground",
											)}
										>
											<item.icon className="size-4" />
										</span>

										<span className="min-w-0 flex-1">
											<span className="block truncate font-medium text-foreground">
												{item.label}
											</span>

											{item.description && (
												<span className="block text-xs text-muted-foreground truncate">
													{item.description}
												</span>
											)}
										</span>

										<Badge
											variant="outline"
											className={cn("shrink-0", !isActive && "hidden")}
										>
											↵
										</Badge>
									</Link>
								);
							})}
						</div>
					))}
				</div>

				<div className="flex items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
							↑
						</kbd>
						<kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
							↓
						</kbd>
						navegar
					</span>

					<span className="flex items-center gap-1.5">
						<kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
							↵
						</kbd>
						abrir
					</span>

					<span className="ml-auto flex items-center gap-1.5">
						<kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
							esc
						</kbd>
						fechar
					</span>
				</div>
			</DialogContent>
		</Dialog>
	);
}
