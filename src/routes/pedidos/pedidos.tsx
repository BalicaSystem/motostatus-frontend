import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { TableSyncIndicator } from "#/components/table-sync-indicator";
import { Button } from "#/components/ui/button";
import { OrderPagination } from "#/features/orders/components/order-pagination";
import { OrderTable } from "#/features/orders/components/order-table";
import { OrderTableSkeleton } from "#/features/orders/components/order-table-skeleton";
import { useOrders } from "#/features/orders/hooks/use-orders";

export function OrdersPage() {
	const navigate = useNavigate();
	const { page } = useSearch({ strict: false });

	const { data, isLoading, isPlaceholderData, isError } = useOrders(page);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/pedidos",
			search: {
				page: nextPage,
			},
		});
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
						<OrderTable orders={data.orders} />

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
		</PageContainer>
	);
}
