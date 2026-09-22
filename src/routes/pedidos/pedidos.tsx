import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { openCreateDrawer } from "#/components/create-drawers";
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

	const [selection, setSelection] = useState<{
		order: OrderListItem;
		mode: "view" | "edit";
	} | null>(null);

	const { data, isLoading, isPlaceholderData, isError } = useOrders(page);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/pedidos",
			search: {
				page: nextPage,
			},
		});
	}

	function handleSelectOrder(
		order: OrderListItem,
		mode: "view" | "edit" = "view",
	) {
		setSelection({ order, mode });
	}

	return (
		<PageContainer>
			<PageHeader
				title="Pedidos"
				description="Gerencie os pedidos da concessionária."
				actions={
					<Button onClick={() => openCreateDrawer("pedido")}>
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
				orderId={selection?.order.id ?? null}
				open={selection !== null}
				onOpenChange={(open) => {
					if (!open) {
						setSelection(null);
					}
				}}
				startInEdit={selection?.mode === "edit"}
			/>
		</PageContainer>
	);
}
