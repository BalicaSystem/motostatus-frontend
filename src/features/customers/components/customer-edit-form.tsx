import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
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
import { useCustomer } from "../hooks/use-customer";
import { useUpdateCustomer } from "../hooks/use-update-customer";
import {
	type CustomerFormData,
	customerSchema,
} from "../schemas/customer-schema";

type CustomerEditFormProps = {
	customerId: string;
};

export function CustomerEditForm({ customerId }: CustomerEditFormProps) {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useCustomer(customerId);
	const updateCustomer = useUpdateCustomer();

	const form = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			name: "",
			document: "",
			city: "",
		},
	});

	useEffect(() => {
		if (!data?.customer) {
			return;
		}

		form.reset({
			name: data.customer.name,
			document: data.customer.document,
			city: data.customer.city,
		});
	}, [data, form]);

	async function onSubmit(values: CustomerFormData) {
		try {
			await updateCustomer.mutateAsync({
				id: customerId,
				data: values,
			});

			toast.success("Cliente atualizado com sucesso", {
				description: "As alterações foram salvas.",
			});

			await navigate({ to: "/clientes", search: { page: 1 } });
		} catch (error) {
			toast.error("Não foi possível atualizar o cliente", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	if (isLoading) {
		return <div className="h-80 animate-pulse rounded-lg border bg-muted/30" />;
	}

	if (isError || !data?.customer) {
		return (
			<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
				<p className="text-sm text-destructive">
					Não foi possível carregar o cliente.
				</p>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dados do cliente</CardTitle>
				<CardDescription>Atualize os dados do cliente.</CardDescription>
			</CardHeader>

			<CardContent>
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
								placeholder="CPF ou CNPJ"
								{...form.register("document")}
							/>

							{form.formState.errors.document && (
								<FieldError>
									{form.formState.errors.document.message}
								</FieldError>
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
							disabled={updateCustomer.isPending}
							onClick={() => navigate({ to: "/clientes", search: { page: 1 } })}
						>
							Cancelar
						</Button>

						<Button type="submit" disabled={updateCustomer.isPending}>
							{updateCustomer.isPending ? "Salvando..." : "Salvar alterações"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
