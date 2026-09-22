import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerField } from "#/components/drawer-field";
import { EntityDrawer } from "#/components/entity-drawer";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDateTime } from "#/lib/formatDateTime";
import { digitsOnly, maskDocument } from "#/lib/masks";
import { getInitials } from "#/lib/utils";
import { useCustomer } from "../hooks/use-customer";
import { useUpdateCustomer } from "../hooks/use-update-customer";
import {
	type CustomerFormData,
	customerSchema,
} from "../schemas/customer-schema";

type CustomerDrawerProps = {
	customerId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	startInEdit?: boolean;
};

export function CustomerDrawer({
	customerId,
	open,
	onOpenChange,
	startInEdit = false,
}: CustomerDrawerProps) {
	const { data, isLoading } = useCustomer(customerId ?? "");
	const updateCustomer = useUpdateCustomer();
	const [editing, setEditing] = useState(false);

	const form = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			name: "",
			document: "",
			city: "",
		},
	});

	const customer = data?.customer;

	useEffect(() => {
		if (!customer) {
			return;
		}

		form.reset({
			name: customer.name,
			document: customer.document,
			city: customer.city,
		});
	}, [customer, form]);

	useEffect(() => {
		if (open) {
			setEditing(startInEdit);
		}
	}, [open, startInEdit]);

	async function handleSave(values: CustomerFormData) {
		if (!customerId) {
			return;
		}

		try {
			await updateCustomer.mutateAsync({ id: customerId, data: values });

			form.reset(values);
			setEditing(false);

			toast.success("Cliente atualizado com sucesso", {
				description: "As alterações foram salvas.",
			});
		} catch (error) {
			toast.error("Não foi possível atualizar o cliente", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	function cancelEdit() {
		if (customer) {
			form.reset({
				name: customer.name,
				document: customer.document,
				city: customer.city,
			});
		}
		setEditing(false);
	}

	const isPending = updateCustomer.isPending;

	return (
		<EntityDrawer
			open={open}
			onOpenChange={(next) => {
				if (!next && editing && form.formState.isDirty) {
					cancelEdit();
				}
				onOpenChange(next);
			}}
			title={customer?.name ?? "Cliente"}
			subtitle={customer?.id}
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
					<Button
						type="button"
						variant="outline"
						onClick={() => setEditing(true)}
					>
						<Pencil />
						Editar cliente
					</Button>
				)
			}
		>
			{isLoading || !customer ? (
				<div className="space-y-4">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			) : (
				<div className="space-y-5">
					<div className="flex items-center gap-4 pb-5 border-b border-border">
						<div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-xl font-bold text-primary">
							{getInitials(customer.name)}
						</div>

						<div className="min-w-0">
							<p className="font-display text-lg leading-none font-bold tracking-[0.03em] uppercase">
								{customer.name}
							</p>

							<p className="mt-1 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
								{customer.id}
							</p>
						</div>
					</div>

					{editing ? (
						<div className="space-y-4">
							<Field data-invalid={!!form.formState.errors.name}>
								<FieldLabel htmlFor="customer-name">Nome</FieldLabel>

								<Input
									id="customer-name"
									placeholder="Nome completo"
									{...form.register("name")}
								/>

								{form.formState.errors.name && (
									<FieldError>{form.formState.errors.name.message}</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.document}>
								<FieldLabel htmlFor="customer-document">CPF ou CNPJ</FieldLabel>

								<Input
									id="customer-document"
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
									<FieldError>
										{form.formState.errors.document.message}
									</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.city}>
								<FieldLabel htmlFor="customer-city">Cidade</FieldLabel>

								<Input
									id="customer-city"
									placeholder="Cidade"
									{...form.register("city")}
								/>

								{form.formState.errors.city && (
									<FieldError>{form.formState.errors.city.message}</FieldError>
								)}
							</Field>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
								<DrawerField label="CPF/CNPJ" mono>
									{customer.document}
								</DrawerField>

								<DrawerField label="Cidade">{customer.city}</DrawerField>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<DrawerField label="Cadastrado em">
									{formatDateTime(customer.createdAt)}
								</DrawerField>

								<DrawerField label="Atualizado em">
									{formatDateTime(customer.updatedAt)}
								</DrawerField>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="secondary">
									<span className="size-1.5 rounded-full bg-secondary-foreground" />
									{customer.city}
								</Badge>
							</div>
						</>
					)}
				</div>
			)}
		</EntityDrawer>
	);
}
