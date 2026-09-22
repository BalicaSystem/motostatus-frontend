import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Bike, Loader2, Save } from "lucide-react";
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
import { Skeleton } from "#/components/ui/skeleton";
import { useOrder } from "../hooks/use-order";
import { useUpdateOrder } from "../hooks/use-update-order";
import {
	type OrderEditFormData,
	type OrderEditFormValues,
	orderEditSchema,
} from "../schemas/order-edit-schema";

type OrderEditFormProps = {
	orderId: string;
};

export function OrderEditForm({ orderId }: OrderEditFormProps) {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useOrder(orderId);
	const updateOrder = useUpdateOrder();

	const form = useForm<OrderEditFormValues, unknown, OrderEditFormData>({
		resolver: zodResolver(orderEditSchema),
		defaultValues: {
			seller: "",
			billingDate: "",
		},
	});

	useEffect(() => {
		if (!data?.order) {
			return;
		}

		form.reset({
			seller: data.order.seller,
			billingDate: data.order.billingDate ?? "",
		});
	}, [data, form]);

	async function onSubmit(values: OrderEditFormData) {
		try {
			await updateOrder.mutateAsync({
				id: orderId,
				data: {
					seller: values.seller,
					billingDate: values.billingDate,
				},
			});

			toast.success("Pedido atualizado com sucesso", {
				description: "As alterações foram salvas.",
			});

			await navigate({ to: "/pedidos/$orderId", params: { orderId } });
		} catch (error) {
			toast.error("Não foi possível atualizar o pedido", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	if (isLoading) {
		return (
			<div className="mx-auto w-full max-w-5xl">
				<div className="grid gap-4 lg:grid-cols-3">
					<Card className="lg:col-span-2">
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>

						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-9 w-full" />
								</div>

								<div className="space-y-2">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-9 w-full" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-36" />
							<Skeleton className="h-4 w-48" />
						</CardHeader>

						<CardContent className="space-y-3">
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-12 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isError || !data?.order) {
		return (
			<Card>
				<CardContent className="flex min-h-48 items-center justify-center">
					<p className="text-sm text-destructive">
						Não foi possível carregar o pedido.
					</p>
				</CardContent>
			</Card>
		);
	}

	const { order, orderItems } = data;

	return (
		<div className="mx-auto w-full max-w-5xl">
			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Dados do pedido</CardTitle>
						<CardDescription>Altere os dados do pedido.</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<Field data-invalid={!!form.formState.errors.seller}>
									<FieldLabel htmlFor="seller">Vendedor</FieldLabel>

									<Input
										id="seller"
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
									<FieldLabel htmlFor="billingDate">
										Data de faturamento
									</FieldLabel>

									<Input
										id="billingDate"
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

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									disabled={updateOrder.isPending}
									onClick={() =>
										navigate({ to: "/pedidos/$orderId", params: { orderId } })
									}
								>
									Cancelar
								</Button>

								<Button type="submit" disabled={updateOrder.isPending}>
									{updateOrder.isPending ? (
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

				<Card>
					<CardHeader>
						<CardTitle>Itens do pedido</CardTitle>
						<CardDescription>Motocicletas vinculadas</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<div className="text-sm">
							<p className="font-medium">{order.customer.name}</p>
							<p className="font-mono text-xs text-muted-foreground">
								{order.customer.document}
							</p>
							<p className="text-xs text-muted-foreground">
								{order.customer.city}
							</p>
						</div>

						{orderItems.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-2 rounded-md border p-2 text-sm"
							>
								<Bike className="size-4 shrink-0 text-muted-foreground" />
								<span className="flex-1 font-medium">
									{item.motorcycle.model}
								</span>
								<span className="font-mono text-xs text-muted-foreground">
									{item.motorcycle.chassis}
								</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
