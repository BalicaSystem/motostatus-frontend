import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { digitsOnly, maskDocument } from "#/lib/masks";
import { useCreateCustomer } from "../hooks/use-create-customer";
import {
	type CustomerFormData,
	customerSchema,
} from "../schemas/customer-schema";

type CustomerCreateFormProps = {
	onClose: () => void;
};

export function CustomerCreateForm({ onClose }: CustomerCreateFormProps) {
	const navigate = useNavigate();
	const createCustomer = useCreateCustomer();

	const form = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			name: "",
			document: "",
			city: "",
		},
	});

	async function onSubmit(data: CustomerFormData) {
		try {
			await createCustomer.mutateAsync(data);

			toast.success("Cliente cadastrado com sucesso", {
				description: "O cliente foi adicionado ao sistema.",
			});

			onClose();

			await navigate({ to: "/clientes", search: { page: 1, q: "" } });
		} catch (error) {
			toast.error("Não foi possível cadastrar o cliente", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Field data-invalid={!!form.formState.errors.name}>
					<FieldLabel htmlFor="name">Nome</FieldLabel>

					<Input
						id="name"
						placeholder="Nome completo"
						{...form.register("name")}
					/>

					{form.formState.errors.name && (
						<FieldError>{form.formState.errors.name.message}</FieldError>
					)}
				</Field>

				<Field data-invalid={!!form.formState.errors.document}>
					<FieldLabel htmlFor="document">CPF ou CNPJ</FieldLabel>

					<Input
						id="document"
						name="document"
						placeholder="CPF ou CNPJ"
						inputMode="numeric"
						maxLength={18}
						value={maskDocument(form.watch("document"))}
						onChange={(event) => {
							form.setValue("document", digitsOnly(event.target.value), {
								shouldValidate: true,
								shouldDirty: true,
							});
						}}
					/>

					{form.formState.errors.document && (
						<FieldError>{form.formState.errors.document.message}</FieldError>
					)}
				</Field>
			</div>

			<Field data-invalid={!!form.formState.errors.city}>
				<FieldLabel htmlFor="city">Cidade</FieldLabel>

				<Input id="city" placeholder="Cidade" {...form.register("city")} />

				{form.formState.errors.city && (
					<FieldError>{form.formState.errors.city.message}</FieldError>
				)}
			</Field>

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={onClose}
					disabled={createCustomer.isPending}
				>
					Cancelar
				</Button>

				<Button type="submit" disabled={createCustomer.isPending}>
					{createCustomer.isPending ? (
						<>
							<Loader2 className="animate-spin" />
							Cadastrando...
						</>
					) : (
						<>
							<Plus />
							Cadastrar cliente
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
