import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { OrderEditForm } from "#/features/orders/components/order-edit-form";

export const Route = createFileRoute("/pedidos/$orderId/editar")({
	component: EditOrderPage,
});

function EditOrderPage() {
	const { orderId } = Route.useParams();

	return (
		<PageContainer>
			<PageHeader
				title="Editar pedido"
				description="Atualize os dados do pedido."
				actions={
					<Button
						variant="outline"
						nativeButton={false}
						render={<Link to="/pedidos/$orderId" params={{ orderId }} />}
					>
						<ArrowLeft className="size-4" />
						Voltar
					</Button>
				}
			/>

			<OrderEditForm orderId={orderId} />
		</PageContainer>
	);
}
