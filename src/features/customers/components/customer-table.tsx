import {
	ArrowRight,
	MoreHorizontal,
	Pencil,
	Trash2,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { getInitials } from "#/lib/utils";
import { useDeleteCustomer } from "../hooks/use-delete-customer";
import type { Customer } from "../types/customer";

type CustomerTableProps = {
	customers: Customer[];
	onSelect: (customer: Customer, mode?: "view" | "edit") => void;
};

export function CustomerTable({ customers, onSelect }: CustomerTableProps) {
	const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
		null,
	);
	const deleteCustomer = useDeleteCustomer();

	async function handleDeleteCustomer() {
		if (!customerToDelete) {
			return;
		}

		try {
			await deleteCustomer.mutateAsync(customerToDelete.id);

			toast.success("Cliente excluído com sucesso", {
				description: "O cliente foi removido.",
			});
		} catch (error) {
			toast.error("Não foi possível excluir o cliente", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		} finally {
			setCustomerToDelete(null);
		}
	}

	if (customers.length === 0) {
		return (
			<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
				<Users className="size-8 text-muted-foreground" />

				<p className="text-sm text-muted-foreground">
					Nenhum cliente cadastrado ainda.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
							Cliente
						</TableHead>

						<TableHead className="hidden font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase sm:table-cell">
							CPF/CNPJ
						</TableHead>

						<TableHead className="hidden font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase md:table-cell">
							Cidade
						</TableHead>

						<TableHead className="w-24" />
					</TableRow>
				</TableHeader>

				<TableBody>
					{customers.map((customer) => (
						<TableRow
							key={customer.id}
							className="group cursor-pointer transition-colors hover:bg-primary/[0.04]"
							onClick={() => onSelect(customer)}
						>
							<TableCell className="max-w-[200px]">
								<div className="flex items-center gap-3">
									<Avatar className="rounded-full bg-primary/15">
										<AvatarFallback className="bg-transparent font-display text-xs font-bold text-primary">
											{getInitials(customer.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{customer.name}
										</p>

										<p className="font-mono text-[0.65rem] tracking-wider text-muted-foreground">
											{customer.id}
										</p>
									</div>
								</div>
							</TableCell>

							<TableCell className="hidden font-mono text-sm tracking-wide text-muted-foreground sm:table-cell">
								{customer.document}
							</TableCell>

							<TableCell className="hidden text-sm text-secondary-foreground md:table-cell">
								{customer.city}
							</TableCell>

							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										className="size-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
										onClick={(event) => {
											event.stopPropagation();
											onSelect(customer);
										}}
									>
										<ArrowRight className="size-4" />
										<span className="sr-only">Visualizar</span>
									</Button>

									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="icon-sm"
													className="size-7"
													onClick={(event) => event.stopPropagation()}
												/>
											}
										>
											<MoreHorizontal className="size-4" />
											<span className="sr-only">Ações do cliente</span>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onSelect(customer)}>
												<ArrowRight />
												Visualizar
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => onSelect(customer, "edit")}
											>
												<Pencil />
												Editar
											</DropdownMenuItem>

											<DropdownMenuItem
												variant="destructive"
												onClick={() => setCustomerToDelete(customer)}
											>
												<Trash2 />
												Excluir
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AlertDialog
				open={customerToDelete !== null}
				onOpenChange={(open) => {
					if (!open) {
						setCustomerToDelete(null);
					}
				}}
			>
				<AlertDialogPopup>
					<AlertDialogTitle>Excluir cliente</AlertDialogTitle>

					<p className="text-sm text-muted-foreground">
						Deseja excluir o cliente{" "}
						<span className="font-medium text-foreground">
							{customerToDelete?.name}
						</span>
						? Esta ação não poderá ser desfeita.
					</p>

					<AlertDialogActions>
						<AlertDialog.Close
							render={
								<Button variant="outline" disabled={deleteCustomer.isPending} />
							}
						>
							Cancelar
						</AlertDialog.Close>

						<AlertDialog.Close
							render={
								<Button
									variant="destructive"
									disabled={deleteCustomer.isPending}
									onClick={handleDeleteCustomer}
								/>
							}
						>
							<Trash2 className="size-4" />
							Excluir
						</AlertDialog.Close>
					</AlertDialogActions>
				</AlertDialogPopup>
			</AlertDialog>
		</div>
	);
}
