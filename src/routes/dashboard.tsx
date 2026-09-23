import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Bike,
	CalendarClock,
	ClipboardList,
	Plus,
	QrCode,
} from "lucide-react";
import { useState } from "react";

import { openCreateDrawer } from "#/components/create-drawers";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { StatCard } from "#/components/stat-card";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { useCustomers } from "#/features/customers/hooks/use-customers";
import { MotorcycleDrawer } from "#/features/motorcycles/components/motorcycle-drawer";
import { MotorcycleStatusBadge } from "#/features/motorcycles/components/motorcycle-status-badge";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";
import type { Motorcycle } from "#/features/motorcycles/types/motorcycle";
import { OrderDrawer } from "#/features/orders/components/order-drawer";
import { useOrders } from "#/features/orders/hooks/use-orders";
import type { OrderListItem } from "#/features/orders/types/order";
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";
import { getInitials } from "#/lib/utils";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const customers = useCustomers();
	const motorcycles = useMotorcycles();
	const orders = useOrders();

	const [openMotorcycleId, setOpenMotorcycleId] = useState<string | null>(null);
	const [motorcycleDrawerOpen, setMotorcycleDrawerOpen] = useState(false);
	const [openOrderId, setOpenOrderId] = useState<string | null>(null);
	const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

	const motorcyclesList = motorcycles.data?.motorcycles ?? [];

	const inTransit = motorcyclesList.filter(
		(motorcycle) => motorcycle.status === "in_transit",
	).length;
	const delayed = motorcyclesList.filter(
		(motorcycle) => motorcycle.status === "delayed",
	).length;

	function arrivalTime(motorcycle: Motorcycle) {
		return motorcycle.estimatedArrival
			? Date.parse(motorcycle.estimatedArrival)
			: Number.MAX_SAFE_INTEGER;
	}

	const recentArrivals = motorcyclesList
		.filter((motorcycle) => motorcycle.status === "arrived")
		.sort((a, b) => arrivalTime(b) - arrivalTime(a))
		.slice(0, 6);

	const recentOrders = (orders.data?.orders ?? []).slice(0, 5);

	function handleMotorcycleSelect(motorcycle: Motorcycle) {
		setOpenMotorcycleId(motorcycle.id);
		setMotorcycleDrawerOpen(true);
	}

	function handleOrderSelect(order: OrderListItem) {
		setOpenOrderId(order.id);
		setOrderDrawerOpen(true);
	}

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

						<Button onClick={() => openCreateDrawer("pedido")}>
							<Plus />
							Novo pedido
						</Button>
					</>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Clientes"
					value={customers.data?.total}
					sub="cadastrados"
					loading={customers.isLoading}
				/>

				<StatCard
					label="Pedidos"
					value={orders.data?.meta.total}
					sub="criados"
					loading={orders.isLoading}
				/>

				<StatCard
					label="Em trânsito"
					value={inTransit}
					sub="unidades na fila"
					accent
					loading={motorcycles.isLoading}
				/>

				<StatCard
					label="Atrasadas"
					value={delayed}
					sub="acompanhar previsão"
					loading={motorcycles.isLoading}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
						<CardTitle className="font-display text-lg font-bold tracking-[0.04em] uppercase">
							Chegadas recentes
						</CardTitle>

						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground"
							render={
								<Link
									to="/motocicletas"
									search={{ page: 1, q: "", status: undefined }}
								/>
							}
						>
							Ver todas
							<ArrowRight />
						</Button>
					</CardHeader>

					<CardContent className="p-0">
						{motorcycles.isLoading ? (
							<div className="space-y-3 p-5">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						) : recentArrivals.length === 0 ? (
							<div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
								<CalendarClock className="size-8 text-muted-foreground" />

								<p className="text-sm text-muted-foreground">
									Nenhuma chegada registrada ainda.
								</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
											Modelo
										</TableHead>

										<TableHead className="hidden font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase sm:table-cell">
											Previsão
										</TableHead>

										<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
											Status
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{recentArrivals.map((motorcycle) => (
										<TableRow
											key={motorcycle.id}
											className="cursor-pointer transition-colors hover:bg-primary/[0.04]"
											onClick={() => handleMotorcycleSelect(motorcycle)}
										>
											<TableCell className="max-w-[220px]">
												<div className="flex items-center gap-3">
													<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
														<Bike className="size-4" />
													</span>

													<div className="min-w-0">
														<p className="truncate font-medium">
															{motorcycle.model}
														</p>

														<p className="truncate font-mono text-xs text-muted-foreground">
															{motorcycle.chassis}
														</p>
													</div>
												</div>
											</TableCell>

											<TableCell className="hidden font-mono text-sm text-muted-foreground sm:table-cell">
												{formatDate(motorcycle.estimatedArrival)}
											</TableCell>

											<TableCell>
												<MotorcycleStatusBadge status={motorcycle.status} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
						<CardTitle className="font-display text-lg font-bold tracking-[0.04em] uppercase">
							Pedidos recentes
						</CardTitle>

						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground"
							render={<Link to="/pedidos" search={{ page: 1, q: "" }} />}
						>
							Ver todos
							<ArrowRight />
						</Button>
					</CardHeader>

					<CardContent className="space-y-1">
						{orders.isLoading ? (
							<div className="space-y-3">
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						) : recentOrders.length === 0 ? (
							<div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
								<ClipboardList className="size-8 text-muted-foreground" />

								<p className="text-sm text-muted-foreground">
									Nenhum pedido registrado ainda.
								</p>

								<Button size="sm" onClick={() => openCreateDrawer("pedido")}>
									<Plus />
									Criar primeiro pedido
								</Button>
							</div>
						) : (
							recentOrders.map((order) => (
								<button
									type="button"
									key={order.id}
									className="group flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-primary/[0.04]"
									onClick={() => handleOrderSelect(order)}
								>
									<Avatar className="rounded-full bg-primary/15">
										<AvatarFallback className="bg-transparent font-display text-xs font-bold text-primary">
											{getInitials(order.customer.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{order.customer.name}
										</p>

										<p className="truncate font-mono text-[0.65rem] tracking-wider text-muted-foreground">
											{order.id.slice(0, 8).toUpperCase()} ·{" "}
											{formatDateTime(order.createdAt)}
										</p>
									</div>

									<ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
								</button>
							))
						)}
					</CardContent>
				</Card>
			</div>

			<MotorcycleDrawer
				motorcycleId={openMotorcycleId}
				open={motorcycleDrawerOpen}
				onOpenChange={setMotorcycleDrawerOpen}
			/>

			<OrderDrawer
				orderId={openOrderId}
				open={orderDrawerOpen}
				onOpenChange={setOrderDrawerOpen}
			/>
		</PageContainer>
	);
}
