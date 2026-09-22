import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
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
import { useMotorcycle } from "../hooks/use-motorcycle";
import { useUpdateMotorcycle } from "../hooks/use-update-motorcycle";
import {
	type UpdateMotorcycleFormData,
	type UpdateMotorcycleFormValues,
	updateMotorcycleSchema,
} from "../schemas/motorcycle-schema";

type MotorcycleEditFormProps = {
	motorcycleId: string;
};

const statusLabels = {
	in_transit: "Em trânsito",
	delayed: "Atrasada",
	arrived: "Chegou",
} as const;

export function MotorcycleEditForm({ motorcycleId }: MotorcycleEditFormProps) {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useMotorcycle(motorcycleId);
	const updateMotorcycle = useUpdateMotorcycle();

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

	useEffect(() => {
		if (!data?.motorcycle) {
			return;
		}

		const motorcycle = data.motorcycle;

		form.reset({
			model: motorcycle.model,
			chassis: motorcycle.chassis,
			estimatedArrival: motorcycle.estimatedArrival ?? "",
			status: motorcycle.status,
		});
	}, [data, form]);

	async function onSubmit(values: UpdateMotorcycleFormData) {
		try {
			await updateMotorcycle.mutateAsync({
				id: motorcycleId,
				data: {
					model: values.model,
					chassis: values.chassis,
					estimatedArrival: values.estimatedArrival,
					status: values.status,
				},
			});

			toast.success("Motocicleta atualizada com sucesso", {
				description: "As alterações foram salvas.",
			});

			await navigate({
				to: "/motocicletas",
				search: { page: 1 },
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

	if (isLoading) {
		return (
			<div className="mx-auto w-full max-w-3xl">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-72" />
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-9 w-full" />
							</div>

							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-9 w-full" />
							</div>
						</div>

						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-9 w-full" />
						</div>

						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-9 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isError || !data?.motorcycle) {
		return (
			<Card>
				<CardContent className="flex min-h-48 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Não foi possível carregar a motocicleta.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="mx-auto w-full max-w-3xl">
			<Card>
				<CardHeader>
					<CardTitle>Dados da motocicleta</CardTitle>
					<CardDescription>
						Altere os dados da motocicleta e salve as alterações.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<Field data-invalid={!!form.formState.errors.model}>
								<FieldLabel htmlFor="model">Modelo</FieldLabel>

								<Input
									id="model"
									placeholder="Ex.: Honda CG 160"
									{...form.register("model")}
								/>

								{form.formState.errors.model && (
									<FieldError>{form.formState.errors.model.message}</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.chassis}>
								<FieldLabel htmlFor="chassis">Chassi</FieldLabel>

								<Input
									id="chassis"
									placeholder="Informe o chassi"
									{...form.register("chassis")}
								/>

								{form.formState.errors.chassis && (
									<FieldError>
										{form.formState.errors.chassis.message}
									</FieldError>
								)}
							</Field>
						</div>

						<Field data-invalid={!!form.formState.errors.estimatedArrival}>
							<FieldLabel htmlFor="estimatedArrival">
								Previsão de chegada
							</FieldLabel>

							<Input
								id="estimatedArrival"
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
										{
											shouldValidate: true,
										},
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
								<FieldError>{form.formState.errors.status.message}</FieldError>
							)}
						</Field>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={updateMotorcycle.isPending}
								onClick={() =>
									navigate({
										to: "/motocicletas",
										search: { page: 1 },
									})
								}
							>
								Cancelar
							</Button>

							<Button type="submit" disabled={updateMotorcycle.isPending}>
								{updateMotorcycle.isPending ? (
									<>
										<Loader2 className="animate-spin" />
										Salvando...
									</>
								) : (
									<>
										<Save />
										Salvar alterações
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
