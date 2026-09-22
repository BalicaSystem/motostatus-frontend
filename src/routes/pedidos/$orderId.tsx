import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bike, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { OrderItemActions } from "#/features/orders/components/order-item-actions";
import { OrderStatusBadge } from "#/features/orders/components/order-status-badge";
import { useDeleteOrder } from "#/features/orders/hooks/use-delete-order";
import { useOrder } from "#/features/orders/hooks/use-order";
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";

export const Route = createFileRoute("/pedidos/$orderId")({
	component: OrderDetailPage,
});

function OrderDetailPage() {
	const navigate = useNavigate();
	const { orderId } = Route.useParams();
	const { data, isLoading, isError } = useOrder(orderId);
	const deleteOrder = useDeleteOrder();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const orderTitle = data
		? `Pedido ${data.order.id.slice(0, 8).toUpperCase()}`
		: "Pedido";

	async function handleDeleteOrder() {
		try {
			await deleteOrder.mutateAsync(orderId);

			toast.success("Pedido excluído com sucesso", {
				description: "O pedido foi removido.",
			});

			await navigate({ to: "/pedidos", search: { page: 1 } });
		} catch (error) {
			toast.error("Não foi possível excluir o pedido", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		} finally {
			setDeleteDialogOpen(false);
		}
	}

	if (isLoading) {
		return (
			<PageContainer>
				<PageHeader title={orderTitle} description="Detalhes do pedido." />

				<OrderDetailSkeleton />
			</PageContainer>
		);
	}

	if (isError || !data) {
		return (
			<PageContainer>
				<PageHeader title={orderTitle} description="Detalhes do pedido." />

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
				title={orderTitle}
				description="Detalhes do pedido."
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							nativeButton={false}
							render={
								<Link
									to="/pedidos/$orderId/editar"
									params={{ orderId: order.id }}
								/>
							}
						>
							<Pencil className="size-4" />
							Editar
						</Button>

						<Button
							variant="outline"
							className="text-destructive hover:text-destructive"
							disabled={deleteOrder.isPending}
							onClick={() => setDeleteDialogOpen(true)}
						>
							<Trash2 className="size-4" />
							Excluir
						</Button>

						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/pedidos" search={{ page: 1 }} />}
						>
							<ArrowLeft className="size-4" />
							Voltar
						</Button>
					</div>
				}
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
						Itens do pedido, emplacamento e ações
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
										<TableHead>Item</TableHead>
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
												<OrderItemActions orderId={order.id} item={item} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogPopup>
					<AlertDialogTitle>Excluir pedido</AlertDialogTitle>

					<p className="text-sm text-muted-foreground">
						Esta ação removerá o pedido e todos os seus itens. Deseja continuar?
					</p>

					<AlertDialogActions>
						<AlertDialog.Close
							render={
								<Button variant="outline" disabled={deleteOrder.isPending} />
							}
						>
							Cancelar
						</AlertDialog.Close>

						<AlertDialog.Close
							render={
								<Button
									variant="destructive"
									disabled={deleteOrder.isPending}
									onClick={handleDeleteOrder}
								/>
							}
						>
							<Trash2 className="size-4" />
							Excluir
						</AlertDialog.Close>
					</AlertDialogActions>
				</AlertDialogPopup>
			</AlertDialog>
		</PageContainer>
	);
}

function OrderDetailSkeleton() {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2">
				{[0, 1].map((card) => (
					<Card key={card}>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>

						<CardContent className="space-y-2">
							{Array.from({ length: 3 }, (_, index) => index).map((item) => (
								<Skeleton key={item} className="h-4 w-48" />
							))}
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>

				<CardContent>
					<div className="space-y-3">
						{Array.from({ length: 4 }, (_, index) => index).map((item) => (
							<Skeleton key={item} className="h-12 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
