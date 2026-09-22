import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerField } from "#/components/drawer-field";
import { EntityDrawer } from "#/components/entity-drawer";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDate } from "#/lib/formatDate";
import { useMotorcycle } from "../hooks/use-motorcycle";
import { useUpdateMotorcycle } from "../hooks/use-update-motorcycle";
import {
	type UpdateMotorcycleFormData,
	type UpdateMotorcycleFormValues,
	updateMotorcycleSchema,
} from "../schemas/motorcycle-schema";
import { MotorcycleStatusBadge } from "./motorcycle-status-badge";

type MotorcycleDrawerProps = {
	motorcycleId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	startInEdit?: boolean;
	onDeleteRequest?: () => void;
};

const statusLabels = {
	in_transit: "Em trânsito",
	delayed: "Atrasada",
	arrived: "Chegou",
} as const;

export function MotorcycleDrawer({
	motorcycleId,
	open,
	onOpenChange,
	startInEdit = false,
	onDeleteRequest,
}: MotorcycleDrawerProps) {
	const { data, isLoading } = useMotorcycle(motorcycleId ?? "");
	const updateMotorcycle = useUpdateMotorcycle();
	const [editing, setEditing] = useState(false);

	const form = useForm<
		UpdateMotorcycleFormValues,
		unknown,
		UpdateMotorcycleFormData
	>({
		resolver: zodResolver(updateMotorcycleSchema),
		defaultValues: {
			model: "",
			chassis: "",
			estimatedArrival: "",
			status: "in_transit",
		},
	});

	const motorcycle = data?.motorcycle;

	useEffect(() => {
		if (!motorcycle) {
			return;
		}

		form.reset({
			model: motorcycle.model,
			chassis: motorcycle.chassis,
			estimatedArrival: motorcycle.estimatedArrival ?? "",
			status: motorcycle.status,
		});
	}, [motorcycle, form]);

	useEffect(() => {
		if (open) {
			setEditing(startInEdit);
		}
	}, [open, startInEdit]);

	async function handleSave(values: UpdateMotorcycleFormData) {
		if (!motorcycleId) {
			return;
		}

		try {
			await updateMotorcycle.mutateAsync({ id: motorcycleId, data: values });

			form.reset({
				...values,
				estimatedArrival: values.estimatedArrival ?? "",
			});
			setEditing(false);

			toast.success("Motocicleta atualizada com sucesso", {
				description: "As alterações foram salvas.",
			});
		} catch (error) {
			toast.error("Não foi possível atualizar a motocicleta", {
				description:
					error instanceof Error
						? error.message
						: "Verifique os dados e tente novamente.",
			});
		}
	}

	function cancelEdit() {
		if (motorcycle) {
			form.reset({
				model: motorcycle.model,
				chassis: motorcycle.chassis,
				estimatedArrival: motorcycle.estimatedArrival ?? "",
				status: motorcycle.status,
			});
		}
		setEditing(false);
	}

	const isPending = updateMotorcycle.isPending;

	return (
		<EntityDrawer
			open={open}
			onOpenChange={(next) => {
				if (!next && editing && form.formState.isDirty) {
					cancelEdit();
				}
				onOpenChange(next);
			}}
			title={motorcycle?.model ?? "Motocicleta"}
			subtitle={motorcycle?.id}
			footer={
				editing ? (
					<form onSubmit={form.handleSubmit(handleSave)} className="flex gap-2">
						<Button
							type="submit"
							disabled={isPending || !form.formState.isDirty}
						>
							{isPending ? (
								<>
									<Loader2 className="animate-spin" />
									Salvando...
								</>
							) : (
								"Salvar"
							)}
						</Button>

						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={cancelEdit}
						>
							Cancelar
						</Button>
					</form>
				) : (
					<div className="flex w-full gap-2">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={() => setEditing(true)}
						>
							<Pencil />
							Editar unidade
						</Button>

						{onDeleteRequest && (
							<Button
								type="button"
								variant="outline"
								className="text-destructive hover:text-destructive"
								onClick={onDeleteRequest}
							>
								<Trash2 />
								Excluir
							</Button>
						)}
					</div>
				)
			}
		>
			{isLoading || !motorcycle ? (
				<div className="space-y-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			) : (
				<div className="space-y-5">
					<div className="flex items-center gap-3 pb-5 border-b border-border">
						<MotorcycleStatusBadge status={motorcycle.status} />

						<span className="font-mono text-xs tracking-wider text-muted-foreground">
							Unidade {motorcycle.id}
						</span>
					</div>

					{editing ? (
						<div className="space-y-4">
							<Field data-invalid={!!form.formState.errors.model}>
								<FieldLabel htmlFor="motorcycle-model">Modelo</FieldLabel>

								<Input
									id="motorcycle-model"
									placeholder="Ex.: Honda CG 160"
									{...form.register("model")}
								/>

								{form.formState.errors.model && (
									<FieldError>{form.formState.errors.model.message}</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.chassis}>
								<FieldLabel htmlFor="motorcycle-chassis">Chassi</FieldLabel>

								<Input
									id="motorcycle-chassis"
									placeholder="Informe o chassi"
									{...form.register("chassis")}
								/>

								{form.formState.errors.chassis && (
									<FieldError>
										{form.formState.errors.chassis.message}
									</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.estimatedArrival}>
								<FieldLabel htmlFor="motorcycle-arrival">
									Previsão de chegada
								</FieldLabel>

								<Input
									id="motorcycle-arrival"
									type="date"
									{...form.register("estimatedArrival")}
								/>

								{form.formState.errors.estimatedArrival && (
									<FieldError>
										{form.formState.errors.estimatedArrival.message}
									</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.status}>
								<FieldLabel>Status</FieldLabel>

								<Select
									value={form.watch("status")}
									onValueChange={(value) =>
										form.setValue(
											"status",
											value as UpdateMotorcycleFormValues["status"],
											{ shouldValidate: true, shouldDirty: true },
										)
									}
								>
									<SelectTrigger>
										<SelectValue>
											{statusLabels[form.watch("status")]}
										</SelectValue>
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="in_transit">Em trânsito</SelectItem>
										<SelectItem value="delayed">Atrasada</SelectItem>
										<SelectItem value="arrived">Chegou</SelectItem>
									</SelectContent>
								</Select>

								{form.formState.errors.status && (
									<FieldError>
										{form.formState.errors.status.message}
									</FieldError>
								)}
							</Field>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
								<DrawerField label="Modelo">{motorcycle.model}</DrawerField>

								<DrawerField label="Unidade" mono>
									{motorcycle.id}
								</DrawerField>

								<DrawerField label="Previsão de chegada" full>
									{formatDate(motorcycle.estimatedArrival)}
								</DrawerField>
							</div>

							<div className="rounded border border-border bg-accent/40 p-4">
								<DrawerField label="Chassi" mono>
									{motorcycle.chassis}
								</DrawerField>
							</div>
						</>
					)}
				</div>
			)}
		</EntityDrawer>
	);
}
