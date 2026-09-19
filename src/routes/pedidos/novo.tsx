import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { OrderCreateForm } from "#/features/orders/components/order-create-form";

export const Route = createFileRoute("/pedidos/novo")({
	component: NewOrderPage,
});

function NewOrderPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Novo pedido"
				description="Registre um novo pedido de motocicleta."
			/>

			<OrderCreateForm />
		</PageContainer>
	);
}
