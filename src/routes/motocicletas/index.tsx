import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, QrCode } from "lucide-react";
import { useMemo, useState } from "react";

import { openCreateDrawer } from "#/components/create-drawers";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { type FilterOption, StatusFilter } from "#/components/status-filter";
import { TableSyncIndicator } from "#/components/table-sync-indicator";
import { Button } from "#/components/ui/button";
import { MotorcycleCardGrid } from "#/features/motorcycles/components/motorcycle-card-grid";
import { MotorcycleDrawer } from "#/features/motorcycles/components/motorcycle-drawer";
import { MotorcyclePagination } from "#/features/motorcycles/components/motorcycle-pagination";
import { MotorcycleTableSkeleton } from "#/features/motorcycles/components/motorcycle-table-skeleton";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";
import type { Motorcycle } from "#/features/motorcycles/types/motorcycle";

export const Route = createFileRoute("/motocicletas/")({
	validateSearch: (search) => ({
		page: Number(search.page) || 1,
	}),
	component: MotorcyclesPage,
});

const statusOptions: FilterOption[] = [
	{ value: "all", label: "Todos" },
	{ value: "in_transit", label: "Em trânsito" },
	{ value: "delayed", label: "Atrasadas" },
	{ value: "arrived", label: "Chegadas" },
];

type MotorcycleStatusFilter = "all" | "in_transit" | "delayed" | "arrived";

function MotorcyclesPage() {
	const navigate = useNavigate();
	const { page } = Route.useSearch();

	const [statusFilter, setStatusFilter] =
		useState<MotorcycleStatusFilter>("all");
	const [selectedMotorcycle, setSelectedMotorcycle] =
		useState<Motorcycle | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const { data, isLoading, isPlaceholderData, isError } = useMotorcycles(page);

	const filteredMotorcycles = useMemo(() => {
		if (!data) {
			return [];
		}

		if (statusFilter === "all") {
			return data.motorcycles;
		}

		return data.motorcycles.filter(
			(motorcycle) => motorcycle.status === statusFilter,
		);
	}, [data, statusFilter]);

	function handlePageChange(nextPage: number) {
		navigate({
			to: "/motocicletas",
			search: {
				page: nextPage,
			},
		});
	}

	function handleSelectMotorcycle(motorcycle: Motorcycle) {
		setSelectedMotorcycle(motorcycle);
		setDrawerOpen(true);
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

						<Button onClick={() => openCreateDrawer("motocicleta")}>
							<Plus className="size-4" />
							Nova motocicleta
						</Button>
					</div>
				}
			/>

			{isLoading && <MotorcycleTableSkeleton />}

			{isError && (
				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-muted-foreground">
						Não foi possível carregar as motocicletas.
					</p>
				</div>
			)}

			{data && (
				<div className="space-y-3">
					<StatusFilter
						options={statusOptions}
						value={statusFilter as string}
						onChange={(value) =>
							setStatusFilter(value as MotorcycleStatusFilter)
						}
					/>

					<div className="relative">
						<MotorcycleCardGrid
							motorcycles={filteredMotorcycles}
							onSelect={handleSelectMotorcycle}
						/>

						<TableSyncIndicator show={isPlaceholderData} />
					</div>

					<MotorcyclePagination
						page={data.page}
						totalPages={data.totalPages}
						total={data.total}
						perPage={data.perPage}
						onPageChange={handlePageChange}
					/>
				</div>
			)}

			<MotorcycleDrawer
				motorcycleId={selectedMotorcycle?.id ?? null}
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
			/>
		</PageContainer>
	);
}
