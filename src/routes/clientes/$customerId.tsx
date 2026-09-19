import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { CustomerEditForm } from "#/features/customers/components/customer-edit-form";

export const Route = createFileRoute("/clientes/$customerId")({
	component: CustomerEditPage,
});

function CustomerEditPage() {
	const { customerId } = Route.useParams();

	return (
		<PageContainer>
			<PageHeader
				title="Editar cliente"
				description="Atualize os dados do cliente."
			/>

			<CustomerEditForm customerId={customerId} />
		</PageContainer>
	);
}
