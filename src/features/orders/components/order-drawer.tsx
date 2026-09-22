import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerField } from "#/components/drawer-field";
import { EntityDrawer } from "#/components/entity-drawer";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";
import { getInitials } from "#/lib/utils";
import { useOrder } from "../hooks/use-order";
import { useUpdateOrder } from "../hooks/use-update-order";
import {
	type OrderEditFormData,
	type OrderEditFormValues,
	orderEditSchema,
} from "../schemas/order-edit-schema";
import { OrderItemActions } from "./order-item-actions";
import { OrderStatusBadge } from "./order-status-badge";
import { RegistrationStatusBadge } from "./registration-status-badge";

type OrderDrawerProps = {
	orderId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	startInEdit?: boolean;
};

export function OrderDrawer({
	orderId,
	open,
	onOpenChange,
	startInEdit = false,
}: OrderDrawerProps) {
	const { data, isLoading } = useOrder(orderId ?? "");
	const updateOrder = useUpdateOrder();
	const [editing, setEditing] = useState(false);

	const form = useForm<OrderEditFormValues, unknown, OrderEditFormData>({
		resolver: zodResolver(orderEditSchema),
		defaultValues: {
			seller: "",
			billingDate: "",
		},
	});

	const order = data?.order;
	const orderItems = data?.orderItems ?? [];

	const title = order
		? `Pedido ${order.id.slice(0, 8).toUpperCase()}`
		: "Pedido";

	useEffect(() => {
		if (!order) {
			return;
		}

		form.reset({
			seller: order.seller,
			billingDate: order.billingDate ?? "",
		});
	}, [order, form]);

	useEffect(() => {
		if (open) {
			setEditing(startInEdit);
		}
	}, [open, startInEdit]);

	async function handleSave(values: OrderEditFormData) {
		if (!orderId) {
			return;
		}

		try {
			await updateOrder.mutateAsync({ id: orderId, data: values });

			form.reset({
				...values,
				billingDate: values.billingDate ?? "",
			});
			setEditing(false);

			toast.success("Pedido atualizado com sucesso", {
				description: "As alterações foram salvas.",
			});
		} catch (error) {
			toast.error("Não foi possível atualizar o pedido", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	function cancelEdit() {
		if (order) {
			form.reset({
				seller: order.seller,
				billingDate: order.billingDate ?? "",
			});
		}
		setEditing(false);
	}

	const isPending = updateOrder.isPending;

	return (
		<EntityDrawer
			open={open}
			onOpenChange={(next) => {
				if (!next && editing && form.formState.isDirty) {
					cancelEdit();
				}
				onOpenChange(next);
			}}
			width="wide"
			title={title}
			subtitle={order?.id}
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
						Editar pedido
					</Button>
				)
			}
		>
			{isLoading || !order ? (
				<div className="space-y-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			) : (
				<div className="space-y-5">
					<div className="flex items-center gap-3 pb-5 border-b border-border">
						<Avatar>
							<AvatarFallback>
								{getInitials(order.customer.name)}
							</AvatarFallback>
						</Avatar>

						<div className="min-w-0">
							<p className="truncate font-display text-base leading-none font-bold tracking-[0.03em] uppercase">
								{order.customer.name}
							</p>

							<p className="mt-1 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
								{order.customer.document}
							</p>
						</div>

						<span className="ml-auto font-mono text-[0.65rem] tracking-wider text-muted-foreground">
							{formatDate(order.billingDate)}
						</span>
					</div>

					{editing ? (
						<div className="space-y-4">
							<Field data-invalid={!!form.formState.errors.seller}>
								<FieldLabel htmlFor="order-seller">Vendedor</FieldLabel>

								<Input
									id="order-seller"
									placeholder="Nome do vendedor"
									{...form.register("seller")}
								/>

								{form.formState.errors.seller && (
									<FieldError>
										{form.formState.errors.seller.message}
									</FieldError>
								)}
							</Field>

							<Field data-invalid={!!form.formState.errors.billingDate}>
								<FieldLabel htmlFor="order-billing">Faturamento</FieldLabel>

								<Input
									id="order-billing"
									type="date"
									{...form.register("billingDate")}
								/>

								{form.formState.errors.billingDate && (
									<FieldError>
										{form.formState.errors.billingDate.message}
									</FieldError>
								)}
							</Field>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
							<DrawerField label="Vendedor">{order.seller}</DrawerField>

							<DrawerField label="Faturamento">
								{formatDate(order.billingDate)}
							</DrawerField>

							<DrawerField label="Criado em">
								{formatDateTime(order.createdAt)}
							</DrawerField>

							<DrawerField label="Atualizado em">
								{formatDateTime(order.updatedAt)}
							</DrawerField>
						</div>
					)}

					<div>
						<p className="mb-2 font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
							Motocicletas do pedido
						</p>

						{orderItems.length === 0 ? (
							<p className="rounded border border-border bg-accent/40 px-3 py-8 text-center text-sm text-muted-foreground">
								Nenhuma motocicleta neste pedido.
							</p>
						) : (
							<div className="space-y-2">
								{orderItems.map((item) => (
									<div
										key={item.id}
										className="rounded border border-border bg-accent/40 p-3"
									>
										<div className="mb-2 flex flex-wrap items-center gap-2">
											<Bike className="size-4 shrink-0 text-muted-foreground" />

											<span className="truncate text-sm font-semibold text-foreground">
												{item.motorcycle.model}
											</span>

											<span className="ml-auto flex items-center gap-2">
												<OrderStatusBadge status={item.status} />
												<RegistrationStatusBadge
													status={item.registrationStatus}
												/>
											</span>
										</div>

										<p className="mb-3 font-mono text-xs tracking-wide text-muted-foreground">
											{item.motorcycle.chassis}
										</p>

										{!editing && (
											<OrderItemActions orderId={order.id} item={item} />
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</EntityDrawer>
	);
}
