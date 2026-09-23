import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Bike, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useCreateMotorcycle } from "../hooks/use-create-motorcycle";
import {
	type CreateMotorcycleFormData,
	type CreateMotorcycleFormValues,
	createMotorcycleSchema,
} from "../schemas/motorcycle-schema";

type MotorcycleFormProps = {
	onClose: () => void;
};

export function MotorcycleForm({ onClose }: MotorcycleFormProps) {
	const navigate = useNavigate();
	const createMotorcycle = useCreateMotorcycle();

	const form = useForm<
		CreateMotorcycleFormValues,
		unknown,
		CreateMotorcycleFormData
	>({
		resolver: zodResolver(createMotorcycleSchema),
		defaultValues: {
			model: "",
			chassis: "",
			estimatedArrival: "",
		},
	});

	async function onSubmit(data: CreateMotorcycleFormData) {
		try {
			await createMotorcycle.mutateAsync(data);

			toast.success("Motocicleta cadastrada com sucesso", {
				description: "A motocicleta foi adicionada ao estoque.",
			});

			onClose();

			await navigate({
				to: "/motocicletas",
				search: { page: 1, q: "", status: undefined },
			});
		} catch (error) {
			toast.error("Não foi possível cadastrar a motocicleta", {
				description:
					error instanceof Error
						? error.message
						: "Verifique os dados e tente novamente.",
			});
		}
	}

	return (
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
						<FieldError>{form.formState.errors.chassis.message}</FieldError>
					)}
				</Field>
			</div>

			<Field data-invalid={!!form.formState.errors.estimatedArrival}>
				<FieldLabel htmlFor="estimatedArrival">Previsão de chegada</FieldLabel>

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

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					disabled={createMotorcycle.isPending}
					onClick={onClose}
				>
					Cancelar
				</Button>

				<Button type="submit" disabled={createMotorcycle.isPending}>
					{createMotorcycle.isPending ? (
						<>
							<Loader2 className="animate-spin" />
							Cadastrando...
						</>
					) : (
						<>
							<Bike />
							Cadastrar motocicleta
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
