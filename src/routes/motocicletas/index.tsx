import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, QrCode, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { openCreateDrawer } from "#/components/create-drawers";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import { type FilterOption, StatusFilter } from "#/components/status-filter";
import { TableSyncIndicator } from "#/components/table-sync-indicator";
import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { MotorcycleCardGrid } from "#/features/motorcycles/components/motorcycle-card-grid";
import { MotorcycleDrawer } from "#/features/motorcycles/components/motorcycle-drawer";
import { MotorcyclePagination } from "#/features/motorcycles/components/motorcycle-pagination";
import { MotorcycleTableSkeleton } from "#/features/motorcycles/components/motorcycle-table-skeleton";
import { useDeleteMotorcycle } from "#/features/motorcycles/hooks/use-delete-motorcycle";
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
	const [motorcycleToDelete, setMotorcycleToDelete] =
		useState<Motorcycle | null>(null);

	const { data, isLoading, isPlaceholderData, isError } = useMotorcycles(page);
	const deleteMotorcycle = useDeleteMotorcycle();

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

	async function handleDeleteMotorcycle() {
		if (!motorcycleToDelete) {
			return;
		}

		try {
			await deleteMotorcycle.mutateAsync(motorcycleToDelete.id);

			if (selectedMotorcycle?.id === motorcycleToDelete.id) {
				setDrawerOpen(false);
				setSelectedMotorcycle(null);
			}

			toast.success("Motocicleta excluída com sucesso", {
				description: "A motocicleta foi removida do estoque.",
			});
		} catch (error) {
			toast.error("Não foi possível excluir a motocicleta", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		} finally {
			setMotorcycleToDelete(null);
		}
	}

	return (
		<PageContainer>
			<PageHeader
				title="Motocicletas"
				description="Gerencie as motocicletas da concessionária."
				actions={
					<div className="flex flex-wrap items-center gap-2">
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
							onDeleteRequest={setMotorcycleToDelete}
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
				onDeleteRequest={() => {
					if (selectedMotorcycle) {
						setMotorcycleToDelete(selectedMotorcycle);
					}
				}}
			/>

			<AlertDialog
				open={motorcycleToDelete !== null}
				onOpenChange={(open) => {
					if (!open) {
						setMotorcycleToDelete(null);
					}
				}}
			>
				<AlertDialogPopup>
					<AlertDialogTitle>Excluir motocicleta</AlertDialogTitle>

					<p className="text-sm text-muted-foreground">
						Deseja excluir a motocicleta{" "}
						<span className="font-medium text-foreground">
							{motorcycleToDelete?.model}
						</span>{" "}
						(chassi{" "}
						<span className="font-mono font-medium text-foreground">
							{motorcycleToDelete?.chassis}
						</span>
						)? Esta ação não poderá ser desfeita.
					</p>

					<AlertDialogActions>
						<AlertDialog.Close
							render={
								<Button
									variant="outline"
									disabled={deleteMotorcycle.isPending}
								/>
							}
						>
							Cancelar
						</AlertDialog.Close>

						<AlertDialog.Close
							render={
								<Button
									variant="destructive"
									disabled={deleteMotorcycle.isPending}
									onClick={handleDeleteMotorcycle}
								/>
							}
						>
							<Trash2 className="size-4" />
							Excluir
						</AlertDialog.Close>
					</AlertDialogActions>
				</AlertDialogPopup>
			</AlertDialog>
		</PageContainer>
	);
}
