import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { TableSyncIndicator } from "#/components/table-sync-indicator";
import { Button } from "#/components/ui/button";
import { CustomerPagination } from "#/features/customers/components/customer-pagination";
import { CustomerTable } from "#/features/customers/components/customer-table";
import { CustomerTableSkeleton } from "#/features/customers/components/customer-table-skeleton";
import { useCustomers } from "#/features/customers/hooks/use-customers";

export function CustomersPage() {
	const navigate = useNavigate();
	const { page } = useSearch({ strict: false });

	const { data, isLoading, isPlaceholderData, isError } = useCustomers(page);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/clientes",
			search: {
				page: nextPage,
			},
		});
	}

	return (
		<PageContainer>
			<PageHeader
				title="Clientes"
				description="Gerencie os clientes da concessionária."
				actions={
					<Button nativeButton={false} render={<Link to="/clientes/novo" />}>
						<Plus className="size-4" />
						Novo cliente
					</Button>
				}
			/>

			{isLoading && <CustomerTableSkeleton />}

			{isError && (
				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-muted-foreground">
						Não foi possível carregar os clientes.
					</p>
				</div>
			)}

			{data && (
				<div className="space-y-3">
					<div className="relative">
						<CustomerTable customers={data.customers} />

						<TableSyncIndicator show={isPlaceholderData} />
					</div>

					<CustomerPagination
						page={data.page}
						totalPages={data.totalPages}
						total={data.total}
						perPage={data.perPage}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</PageContainer>
	);
}
