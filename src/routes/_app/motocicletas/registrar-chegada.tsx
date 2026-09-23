import { createFileRoute } from "@tanstack/react-router";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { MotorcycleCheckInForm } from "#/features/motorcycles/components/motorcycle-check-in-form";

export const Route = createFileRoute("/_app/motocicletas/registrar-chegada")({
	component: RegistrarChegadaPage,
});

function RegistrarChegadaPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Registrar chegada"
				description="Registre a entrada de uma motocicleta no estoque."
			/>

			<MotorcycleCheckInForm />
		</PageContainer>
	);
}
