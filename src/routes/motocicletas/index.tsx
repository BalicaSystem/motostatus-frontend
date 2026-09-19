import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, QrCode } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { Button } from "#/components/ui/button";
import { MotorcyclePagination } from "#/features/motorcycles/components/motorcycle-pagination";
import { MotorcycleTable } from "#/features/motorcycles/components/motorcycle-table";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";

export const Route = createFileRoute("/motocicletas/")({
	validateSearch: (search) => ({
		page: Number(search.page) || 1,
	}),
	component: MotorcyclesPage,
});

function MotorcyclesPage() {
	const navigate = useNavigate();
	const { page } = Route.useSearch();
	const { data, isLoading, isError } = useMotorcycles(page);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/motocicletas",
			search: { page: nextPage },
		});
	}

	return (
		<PageContainer>
			<PageHeader
				title="Motocicletas"
				description="Gerencie as motocicletas da concessionária."
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/motocicletas/registrar-chegada" />}
						>
							<QrCode className="size-4" />
							Registrar chegada
						</Button>

						<Button
							nativeButton={false}
							render={<Link to="/motocicletas/nova" />}
						>
							<Plus className="size-4" />
							Nova motocicleta
						</Button>
					</div>
				}
			/>

			{isLoading && <div>Carregando motocicletas...</div>}

			{isError && <div>Não foi possível carregar as motocicletas.</div>}

			{data && (
				<>
					<MotorcycleTable motorcycles={data.motorcycles} />

					<MotorcyclePagination
						page={data.page}
						totalPages={data.totalPages}
						total={data.total}
						perPage={data.perPage}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</PageContainer>
	);
}
