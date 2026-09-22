import { Link } from "@tanstack/react-router";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
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
import { useDeleteCustomer } from "../hooks/use-delete-customer";
import type { Customer } from "../types/customer";

type CustomerTableProps = {
	customers: Customer[];
};

export function CustomerTable({ customers }: CustomerTableProps) {
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
			<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
				<p className="text-sm text-muted-foreground">
					Nenhum cliente encontrado.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>CPF/CNPJ</TableHead>
						<TableHead>Cidade</TableHead>
						<TableHead className="w-12" />
					</TableRow>
				</TableHeader>

				<TableBody>
					{customers.map((customer) => (
						<TableRow key={customer.id}>
							<TableCell className="font-medium">{customer.name}</TableCell>

							<TableCell className="font-mono text-sm">
								{customer.document}
							</TableCell>

							<TableCell>{customer.city}</TableCell>

							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="ghost" size="icon" className="size-8" />
										}
									>
										<MoreHorizontal className="size-4" />
										<span className="sr-only">Ações do cliente</span>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem
											render={
												<Link
													to="/clientes/$customerId"
													params={{ customerId: customer.id }}
												/>
											}
										>
											<Eye />
											Visualizar
										</DropdownMenuItem>

										<DropdownMenuItem
											render={
												<Link
													to="/clientes/$customerId/editar"
													params={{ customerId: customer.id }}
												/>
											}
										>
											<Pencil />
											Editar
										</DropdownMenuItem>

										<DropdownMenuItem
											data-danger
											className="text-destructive data-[danger=true]:text-destructive"
											onClick={() => setCustomerToDelete(customer)}
										>
											<Trash2 />
											Excluir
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
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
