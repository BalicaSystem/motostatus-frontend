import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { OrderPagination } from "#/features/orders/components/order-pagination";
import { OrderTable } from "#/features/orders/components/order-table";
import { OrderTableSkeleton } from "#/features/orders/components/order-table-skeleton";
import { useOrders } from "#/features/orders/hooks/use-orders";

export function OrdersPage() {
	const navigate = useNavigate();
	const { page } = useSearch({ strict: false });

	const { data, isLoading, isFetching, isError } = useOrders(page);

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

						{isFetching && (
							<div className="absolute inset-0 flex items-start justify-center bg-background/40 pt-4 backdrop-blur-[1px]">
								<div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
									Atualizando...
								</div>
							</div>
						)}
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
