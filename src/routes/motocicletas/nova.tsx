import { createFileRoute } from "@tanstack/react-router";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { MotorcycleForm } from "#/features/motorcycles/components/motorcycle-form";

export const Route = createFileRoute("/motocicletas/nova")({
	component: NewMotorcyclePage,
});

function NewMotorcyclePage() {
	return (
		<PageContainer>
			<PageHeader
				title="Nova motocicleta"
				description="Cadastre uma nova motocicleta no estoque."
			/>

			<MotorcycleForm />
		</PageContainer>
	);
}
