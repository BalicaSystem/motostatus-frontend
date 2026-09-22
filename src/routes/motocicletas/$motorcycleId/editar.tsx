import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { MotorcycleEditForm } from "#/features/motorcycles/components/motorcycle-edit-form";

export const Route = createFileRoute("/motocicletas/$motorcycleId/editar")({
	component: EditMotorcyclePage,
});

function EditMotorcyclePage() {
	const { motorcycleId } = Route.useParams();

	return (
		<PageContainer>
			<PageHeader
				title="Editar motocicleta"
				description="Atualize os dados da motocicleta."
				actions={
					<Button
						variant="outline"
						nativeButton={false}
						render={
							<Link
								to="/motocicletas/$motorcycleId"
								params={{ motorcycleId }}
							/>
						}
					>
						<ArrowLeft className="size-4" />
						Voltar
					</Button>
				}
			/>

			<MotorcycleEditForm motorcycleId={motorcycleId} />
		</PageContainer>
	);
}
