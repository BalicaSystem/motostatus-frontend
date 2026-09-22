import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	ArrowUpRight,
	Bike,
	CalendarClock,
	ClipboardList,
	Plus,
	QrCode,
	Truck,
	Users,
} from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { useCustomers } from "#/features/customers/hooks/use-customers";
import { MotorcycleStatusBadge } from "#/features/motorcycles/components/motorcycle-status-badge";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";
import type { Motorcycle } from "#/features/motorcycles/types/motorcycle";
import { useOrders } from "#/features/orders/hooks/use-orders";
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";
import { getInitials } from "#/lib/utils";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

const statusRows = [
	{
		status: "in_transit" as const,
		label: "Em trânsito",
		icon: Truck,
		bar: "bg-sky-500",
	},
	{
		status: "delayed" as const,
		label: "Atrasadas",
		icon: CalendarClock,
		bar: "bg-rose-500",
	},
	{
		status: "arrived" as const,
		label: "Chegadas",
		icon: Bike,
		bar: "bg-emerald-500",
	},
];

function DashboardPage() {
	const customers = useCustomers();
	const motorcycles = useMotorcycles();
	const orders = useOrders();

	const stats = [
		{
			label: "Clientes",
			value: customers.data?.total,
			detail: "cadastrados",
			icon: Users,
			href: "/clientes" as const,
			loading: customers.isLoading,
		},
		{
			label: "Motocicletas",
			value: motorcycles.data?.total,
			detail: "em operação",
			icon: Bike,
			href: "/motocicletas" as const,
			loading: motorcycles.isLoading,
		},
		{
			label: "Pedidos",
			value: orders.data?.meta.total,
			detail: "criados",
			icon: ClipboardList,
			href: "/pedidos" as const,
			loading: orders.isLoading,
		},
	];

	const totalMotorcycles = motorcycles.data?.total ?? 0;
	const motorcyclesList = motorcycles.data?.motorcycles ?? [];

	function arrivalTime(motorcycle: Motorcycle) {
		return motorcycle.estimatedArrival
			? Date.parse(motorcycle.estimatedArrival)
			: Number.MAX_SAFE_INTEGER;
	}

	const statusCounts = statusRows.map((row) => ({
		...row,
		count: motorcyclesList.filter((m) => m.status === row.status).length,
	}));

	const upcoming = motorcyclesList
		.filter(
			(motorcycle) =>
				motorcycle.status !== "arrived" && motorcycle.estimatedArrival,
		)
		.sort((a, b) => arrivalTime(a) - arrivalTime(b))
		.slice(0, 5);

	const recentOrders = (orders.data?.orders ?? []).slice(0, 5);

	return (
		<PageContainer>
			<PageHeader
				title="Dashboard"
				description="Visão geral da operação da concessionária."
				actions={
					<>
						<Button
							variant="outline"
							render={<Link to="/motocicletas/registrar-chegada" />}
						>
							<QrCode />
							Registrar chegada
						</Button>

						<Button render={<Link to="/pedidos/novo" />}>
							<Plus />
							Novo pedido
						</Button>
					</>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<Card key={stat.label} className="overflow-hidden">
						<CardHeader className="flex flex-row items-center gap-4">
							<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<stat.icon className="size-5" />
							</span>

							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									{stat.label}
								</CardTitle>

								<CardDescription>{stat.detail}</CardDescription>
							</div>
						</CardHeader>

						<CardContent>
							{stat.loading ? (
								<Skeleton className="h-8 w-20" />
							) : (
								<p className="text-4xl font-semibold tracking-tight">
									{stat.value ?? "—"}
								</p>
							)}

							<Link
								to={stat.href}
								search={{ page: 1 }}
								className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
							>
								Ver detalhes
								<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-5">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Fila de operação</CardTitle>
						<CardDescription>
							Distribuição das motocicletas por status.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						{motorcycles.isLoading ? (
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						) : totalMotorcycles === 0 ? (
							<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
								<Truck className="size-8 text-muted-foreground" />

								<p className="text-sm text-muted-foreground">
									Nenhuma motocicleta no sistema ainda.
								</p>

								<Button
									variant="outline"
									size="sm"
									render={<Link to="/motocicletas/nova" />}
								>
									<Plus />
									Cadastrar motocicleta
								</Button>
							</div>
						) : (
							statusCounts.map((row) => {
								const percentage =
									totalMotorcycles > 0
										? Math.round((row.count / totalMotorcycles) * 100)
										: 0;

								return (
									<div key={row.status} className="space-y-1.5">
										<div className="flex items-center justify-between text-sm">
											<span className="flex items-center gap-2 text-muted-foreground">
												<row.icon className="size-3.5" />
												{row.label}
											</span>

											<span className="font-medium tabular-nums">
												{row.count}
												<span className="ml-1 text-xs text-muted-foreground">
													({percentage}%)
												</span>
											</span>
										</div>

										<div className="h-2 overflow-hidden rounded-full bg-muted">
											<div
												className={[
													"h-full rounded-full transition-all",
													row.bar,
												].join(" ")}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})
						)}
					</CardContent>
				</Card>

				<Card className="lg:col-span-3">
					<CardHeader className="flex flex-row items-start justify-between">
						<div className="space-y-1">
							<CardTitle>Próximas chegadas</CardTitle>
							<CardDescription>
								Primeiras entregas previstas da fila.
							</CardDescription>
						</div>

						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground"
							render={<Link to="/motocicletas" search={{ page: 1 }} />}
						>
							Ver todas
							<ArrowRight />
						</Button>
					</CardHeader>

					<CardContent className="divide-y gap-0 sm:gap-0">
						{upcoming.length === 0 ? (
							<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
								<CalendarClock className="size-8 text-muted-foreground" />

								<p className="text-sm text-muted-foreground">
									Não há chegadas pendentes no momento.
								</p>
							</div>
						) : (
							upcoming.map((motorcycle) => (
								<UpcomingRow key={motorcycle.id} motorcycle={motorcycle} />
							))
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-start justify-between">
					<div className="space-y-1">
						<CardTitle>Pedidos recentes</CardTitle>
						<CardDescription>
							Últimos pedidos registrados na concessionária.
						</CardDescription>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground"
						render={<Link to="/pedidos" search={{ page: 1 }} />}
					>
						Ver todos
						<ArrowRight />
					</Button>
				</CardHeader>

				<CardContent className="divide-y gap-0 sm:gap-0">
					{recentOrders.length === 0 ? (
						<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
							<ClipboardList className="size-8 text-muted-foreground" />

							<p className="text-sm text-muted-foreground">
								Nenhum pedido registrado ainda.
							</p>

							<Button size="sm" render={<Link to="/pedidos/novo" />}>
								<Plus />
								Criar primeiro pedido
							</Button>
						</div>
					) : (
						recentOrders.map((order) => (
							<Link
								key={order.id}
								to="/pedidos/$orderId"
								params={{ orderId: order.id }}
								className="group flex items-center gap-4 rounded-md py-3 transition-colors hover:bg-muted/50 sm:px-2"
							>
								<Avatar>
									<AvatarFallback>
										{getInitials(order.customer.name)}
									</AvatarFallback>
								</Avatar>

								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{order.customer.name}</p>

									<p className="truncate text-xs text-muted-foreground">
										{order.motorcycles.length > 0
											? `${order.motorcycles.length} motocicleta${order.motorcycles.length > 1 ? "s" : ""} · ${order.customer.document}`
											: order.customer.document}
									</p>
								</div>

								<div className="hidden text-right sm:block">
									<p className="text-sm">{order.seller}</p>
									<p className="text-xs text-muted-foreground">
										{formatDateTime(order.createdAt)}
									</p>
								</div>

								<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
							</Link>
						))
					)}
				</CardContent>
			</Card>
		</PageContainer>
	);
}

function UpcomingRow({ motorcycle }: { motorcycle: Motorcycle }) {
	return (
		<Link
			to="/motocicletas/$motorcycleId"
			params={{ motorcycleId: motorcycle.id }}
			className="group flex items-center gap-4 py-3 transition-colors hover:bg-muted/50 sm:px-2"
		>
			<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
				<Bike className="size-4" />
			</span>

			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{motorcycle.model}</p>

				<p className="truncate font-mono text-xs text-muted-foreground">
					{motorcycle.chassis}
				</p>
			</div>

			<div className="hidden text-right sm:block">
				<p className="text-sm">{formatDate(motorcycle.estimatedArrival)}</p>
				<p className="text-xs text-muted-foreground">Previsão de chegada</p>
			</div>

			<MotorcycleStatusBadge status={motorcycle.status} />

			<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
		</Link>
	);
}
