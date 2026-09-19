import { createFileRoute } from "@tanstack/react-router";
import { Bike } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { OrderStatusBadge } from "#/features/orders/components/order-status-badge";
import { RegistrationStatusBadge } from "#/features/orders/components/registration-status-badge";
import { useOrder } from "#/features/orders/hooks/use-order";
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";

export const Route = createFileRoute("/pedidos/$orderId")({
	component: OrderDetailPage,
});

function OrderDetailPage() {
	const { orderId } = Route.useParams();
	const { data, isLoading, isError } = useOrder(orderId);

	if (isLoading) {
		return (
			<PageContainer>
				<div className="h-80 animate-pulse rounded-lg border bg-muted/30" />
			</PageContainer>
		);
	}

	if (isError || !data) {
		return (
			<PageContainer>
				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-destructive">
						Não foi possível carregar o pedido.
					</p>
				</div>
			</PageContainer>
		);
	}

	const { order, orderItems } = data;

	return (
		<PageContainer>
			<PageHeader
				title={`Pedido ${order.id.slice(0, 8).toUpperCase()}`}
				description="Detalhes do pedido."
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Cliente</CardTitle>
						<CardDescription>Dados do cliente do pedido</CardDescription>
					</CardHeader>

					<CardContent className="space-y-1 text-sm">
						<p className="font-medium">{order.customer.name}</p>
						<p className="font-mono text-muted-foreground">
							{order.customer.document}
						</p>
						<p className="text-muted-foreground">{order.customer.city}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Informações</CardTitle>
						<CardDescription>Dados gerais do pedido</CardDescription>
					</CardHeader>

					<CardContent className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Vendedor</span>
							<span className="font-medium">{order.seller}</span>
						</div>

						<div className="flex justify-between">
							<span className="text-muted-foreground">Faturamento</span>
							<span className="font-medium">
								{formatDate(order.billingDate)}
							</span>
						</div>

						<div className="flex justify-between">
							<span className="text-muted-foreground">Criado em</span>
							<span className="font-medium">
								{formatDateTime(order.createdAt)}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Motocicletas</CardTitle>
					<CardDescription>
						Itens do pedido e status de registro
					</CardDescription>
				</CardHeader>

				<CardContent>
					{orderItems.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Nenhuma motocicleta neste pedido.
						</p>
					) : (
						<div className="overflow-hidden rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Modelo</TableHead>
										<TableHead>Chassi</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Emplacamento</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{orderItems.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													<Bike className="size-4 text-muted-foreground" />
													{item.motorcycle.model}
												</div>
											</TableCell>

											<TableCell className="font-mono text-sm">
												{item.motorcycle.chassis}
											</TableCell>

											<TableCell>
												<OrderStatusBadge status={item.status} />
											</TableCell>

											<TableCell>
												<RegistrationStatusBadge
													status={item.registrationStatus}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</PageContainer>
	);
}
