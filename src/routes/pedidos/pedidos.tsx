import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { TableSyncIndicator } from "#/components/table-sync-indicator";
import { Button } from "#/components/ui/button";
import { OrderDrawer } from "#/features/orders/components/order-drawer";
import { OrderPagination } from "#/features/orders/components/order-pagination";
import { OrderTable } from "#/features/orders/components/order-table";
import { OrderTableSkeleton } from "#/features/orders/components/order-table-skeleton";
import { useOrders } from "#/features/orders/hooks/use-orders";
import type { OrderListItem } from "#/features/orders/types/order";

export function OrdersPage() {
	const navigate = useNavigate();
	const { page } = useSearch({ strict: false });

	const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
		null,
	);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const { data, isLoading, isPlaceholderData, isError } = useOrders(page);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/pedidos",
			search: {
				page: nextPage,
			},
		});
	}

	function handleSelectOrder(order: OrderListItem) {
		setSelectedOrder(order);
		setDrawerOpen(true);
	}

	return (
		<PageContainer>
			<PageHeader
				title="Pedidos"
				description="Gerencie os pedidos da concessionária."
				actions={
					<Button nativeButton={false} render={<Link to="/pedidos/novo" />}>
						<Plus className="size-4" />
						Novo pedido
					</Button>
				}
			/>

			{isLoading && <OrderTableSkeleton />}

			{isError && (
				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-muted-foreground">
						Não foi possível carregar os pedidos.
					</p>
				</div>
			)}

			{data && (
				<div className="space-y-3">
					<div className="relative">
						<OrderTable orders={data.orders} onSelect={handleSelectOrder} />

						<TableSyncIndicator show={isPlaceholderData} />
					</div>

					<OrderPagination
						page={data.meta.page}
						totalPages={data.meta.totalPages}
						total={data.meta.total}
						perPage={data.meta.perPage}
						onPageChange={handlePageChange}
					/>
				</div>
			)}

			<OrderDrawer
				orderId={selectedOrder?.id ?? null}
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
			/>
		</PageContainer>
	);
}
