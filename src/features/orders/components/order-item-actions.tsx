import { CheckCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useCompleteOrderItem } from "../hooks/use-complete-order-item";
import { useReleaseOrderItem } from "../hooks/use-release-order-item";
import { useUpdateOrderItem } from "../hooks/use-update-order-item";
import type {
	OrderItemWithMotorcycle,
	RegistrationStatus,
} from "../types/order";
import { RegistrationStatusBadge } from "./registration-status-badge";

type OrderItemActionsProps = {
	orderId: string;
	item: OrderItemWithMotorcycle;
};

const registrationLabels: Record<RegistrationStatus, string> = {
	without_registration: "Sem emplacamento",
	registering: "Emplacando",
	registered: "Emplacado",
};

type Confirmation = {
	kind: "release" | "complete";
};

export function OrderItemActions({ orderId, item }: OrderItemActionsProps) {
	const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
	const updateOrderItem = useUpdateOrderItem();
	const releaseOrderItem = useReleaseOrderItem();
	const completeOrderItem = useCompleteOrderItem();

	const isCompleted = item.status === "completed";
	const isPending =
		updateOrderItem.isPending ||
		releaseOrderItem.isPending ||
		completeOrderItem.isPending;

	async function handleRegistrationStatusChange(
		status: RegistrationStatus | null,
	) {
		if (!status) {
			return;
		}

		try {
			await updateOrderItem.mutateAsync({
				id: item.id,
				orderId,
				data: { registrationStatus: status },
			});
		} catch (error) {
			toast.error("Não foi possível atualizar o emplacamento", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	async function handleRegistrationDateChange(value: string) {
		try {
			await updateOrderItem.mutateAsync({
				id: item.id,
				orderId,
				data: {
					registrationDate: value === "" ? null : value,
				},
			});
		} catch (error) {
			toast.error("Não foi possível atualizar a data de emplacamento", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		}
	}

	async function handleConfirm() {
		if (!confirmation) {
			return;
		}

		try {
			if (confirmation.kind === "release") {
				await releaseOrderItem.mutateAsync({ id: item.id, orderId });

				toast.success("Item liberado com sucesso", {
					description: "O item foi liberado para a próxima etapa.",
				});
			} else {
				await completeOrderItem.mutateAsync({ id: item.id, orderId });

				toast.success("Item concluído com sucesso", {
					description: "O item foi concluído.",
				});
			}
		} catch (error) {
			toast.error("Não foi possível concluir a ação", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		} finally {
			setConfirmation(null);
		}
	}

	if (isCompleted) {
		return (
			<div className="flex items-center gap-2">
				<CheckCheck className="size-4 text-muted-foreground" />
				<span className="text-xs text-muted-foreground">Concluído</span>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center gap-2">
				<Select
					value={item.registrationStatus}
					onValueChange={handleRegistrationStatusChange}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue>
							{registrationLabels[item.registrationStatus]}
						</SelectValue>
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="without_registration">
							Sem emplacamento
						</SelectItem>
						<SelectItem value="registering">Emplacando</SelectItem>
						<SelectItem value="registered">Emplacado</SelectItem>
					</SelectContent>
				</Select>

				<Input
					type="date"
					value={item.registrationDate ?? ""}
					disabled={isPending}
					onChange={(event) => handleRegistrationDateChange(event.target.value)}
					className="h-8 w-40 text-xs"
				/>

				<RegistrationStatusBadge status={item.registrationStatus} />
			</div>

			<div className="flex gap-2">
				<Button
					variant="outline"
					size="xs"
					disabled={isPending}
					onClick={() => setConfirmation({ kind: "release" })}
				>
					Liberar
				</Button>

				<Button
					variant="default"
					size="xs"
					disabled={isPending}
					onClick={() => setConfirmation({ kind: "complete" })}
				>
					Concluir
				</Button>
			</div>

			<AlertDialog
				open={confirmation !== null}
				onOpenChange={(open) => {
					if (!open) {
						setConfirmation(null);
					}
				}}
			>
				<AlertDialogPopup>
					<AlertDialogTitle>
						{confirmation?.kind === "release"
							? "Liberar item"
							: "Concluir item"}
					</AlertDialogTitle>

					<p className="text-sm text-muted-foreground">
						{confirmation?.kind === "release"
							? "Deseja liberar este item do pedido?"
							: "Deseja concluir este item do pedido? Esta ação não poderá ser desfeita."}
					</p>

					<AlertDialogActions>
						<AlertDialog.Close
							render={<Button variant="outline" disabled={isPending} />}
						>
							Cancelar
						</AlertDialog.Close>

						<AlertDialog.Close
							render={
								<Button
									variant={
										confirmation?.kind === "complete"
											? "destructive"
											: "default"
									}
									disabled={isPending}
									onClick={handleConfirm}
								/>
							}
						>
							{isPending ? (
								<>
									<Loader2 className="animate-spin" />
									Processando...
								</>
							) : confirmation?.kind === "release" ? (
								"Liberar"
							) : (
								<>
									<CheckCheck />
									Concluir
								</>
							)}
						</AlertDialog.Close>
					</AlertDialogActions>
				</AlertDialogPopup>
			</AlertDialog>
		</div>
	);
}
