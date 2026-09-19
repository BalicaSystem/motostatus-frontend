import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { CustomerTable } from "#/features/customers/components/customer-table";
import { useCustomers } from "#/features/customers/hooks/use-customers";

export function CustomersPage() {
	const { data, isLoading, isError } = useCustomers();

	if (isLoading) {
		return (
			<PageContainer>
				<PageHeader
					title="Clientes"
					description="Gerencie os clientes da concessionária."
					actions={
						<Button nativeButton={false} render={<Link to="/clientes/novo" />}>
							Novo cliente
						</Button>
					}
				/>

				<div className="h-40 animate-pulse rounded-lg border bg-muted/30" />
			</PageContainer>
		);
	}

	if (isError) {
		return (
			<PageContainer>
				<PageHeader
					title="Clientes"
					description="Gerencie os clientes da concessionária."
				/>

				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-destructive">
						Não foi possível carregar os clientes.
					</p>
				</div>
			</PageContainer>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<PageContainer>
			<PageHeader
				title="Clientes"
				description="Gerencie os clientes da concessionária."
				actions={
					<Button render={<Link to="/clientes/novo" />}>
						<Plus />
						Novo cliente
					</Button>
				}
			/>

			<CustomerTable customers={data.customers} />
		</PageContainer>
	);
}
