import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { CustomerEditForm } from "#/features/customers/components/customer-edit-form";

export const Route = createFileRoute("/clientes/$customerId/editar")({
	component: CustomerEditPage,
});

function CustomerEditPage() {
	const { customerId } = Route.useParams();

	return (
		<PageContainer>
			<PageHeader
				title="Editar cliente"
				description="Atualize os dados do cliente."
				actions={
					<Button
						variant="outline"
						nativeButton={false}
						render={
							<Link
								to="/clientes/$customerId"
								params={{ customerId }}
							/>
						}
					>
						<ArrowLeft className="size-4" />
						Voltar
					</Button>
				}
			/>

			<CustomerEditForm customerId={customerId} />
		</PageContainer>
	);
}