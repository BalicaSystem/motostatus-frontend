import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DetailField, DetailList } from "#/components/detail-field";
import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
import {
	AlertDialog,
	AlertDialogActions,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { useCustomer } from "#/features/customers/hooks/use-customer";
import { useDeleteCustomer } from "#/features/customers/hooks/use-delete-customer";
import { formatDateTime } from "#/lib/formatDateTime";
import { getInitials } from "#/lib/utils";

export const Route = createFileRoute("/clientes/$customerId/")({
	component: CustomerDetailsPage,
});

function CustomerDetailsPage() {
	const navigate = useNavigate();
	const { customerId } = Route.useParams();
	const { data, isLoading, isError } = useCustomer(customerId);
	const deleteCustomer = useDeleteCustomer();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	async function handleDeleteCustomer() {
		try {
			await deleteCustomer.mutateAsync(customerId);

			toast.success("Cliente excluído com sucesso", {
				description: "O cliente foi removido.",
			});

			await navigate({ to: "/clientes", search: { page: 1 } });
		} catch (error) {
			toast.error("Não foi possível excluir o cliente", {
				description:
					error instanceof Error ? error.message : "Tente novamente.",
			});
		} finally {
			setDeleteDialogOpen(false);
		}
	}

	if (isLoading) {
		return (
			<PageContainer>
				<PageHeader
					title="Cliente"
					description="Visualização dos dados do cliente."
				/>

				<CustomerDetailsSkeleton />
			</PageContainer>
		);
	}

	if (isError || !data) {
		return (
			<PageContainer>
				<PageHeader
					title="Cliente"
					description="Visualização dos dados do cliente."
				/>

				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-destructive">
						Não foi possível carregar o cliente.
					</p>
				</div>
			</PageContainer>
		);
	}

	const { customer } = data;

	return (
		<PageContainer>
			<PageHeader
				title={customer.name}
				description="Visualização dos dados do cliente."
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							nativeButton={false}
							render={
								<Link
									to="/clientes/$customerId/editar"
									params={{ customerId: customer.id }}
								/>
							}
						>
							<Pencil className="size-4" />
							Editar
						</Button>

						<Button
							variant="outline"
							className="text-destructive hover:text-destructive"
							disabled={deleteCustomer.isPending}
							onClick={() => setDeleteDialogOpen(true)}
						>
							<Trash2 className="size-4" />
							Excluir
						</Button>

						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/clientes" search={{ page: 1 }} />}
						>
							<ArrowLeft className="size-4" />
							Voltar
						</Button>
					</div>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Dados do cliente</CardTitle>
						<CardDescription>
							Informações cadastradas do cliente.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="flex items-center gap-4 pb-5">
							<Avatar size="lg">
								<AvatarFallback className="text-lg">
									{getInitials(customer.name)}
								</AvatarFallback>
							</Avatar>

							<div className="min-w-0">
								<p className="text-base font-semibold">{customer.name}</p>

								<p className="text-sm text-muted-foreground">{customer.city}</p>
							</div>
						</div>

						<Separator className="mb-5" />

						<DetailList>
							<DetailField
								label="CPF/CNPJ"
								mono
								copyValue={customer.document}
								copyLabel="CPF/CNPJ copiado"
							>
								{customer.document}
							</DetailField>

							<DetailField label="Cidade">{customer.city}</DetailField>

							<DetailField label="Cadastrado em">
								{formatDateTime(customer.createdAt)}
							</DetailField>

							<DetailField label="Última atualização">
								{formatDateTime(customer.updatedAt)}
							</DetailField>
						</DetailList>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Identificação</CardTitle>
						<CardDescription>Identificador interno do cliente.</CardDescription>
					</CardHeader>

					<CardContent>
						<DetailList className="sm:grid-cols-1">
							<DetailField
								label="ID do cliente"
								mono
								copyValue={customer.id}
								copyLabel="ID do cliente copiado"
							>
								{customer.id}
							</DetailField>
						</DetailList>
					</CardContent>
				</Card>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogPopup>
					<AlertDialogTitle>Excluir cliente</AlertDialogTitle>

					<p className="text-sm text-muted-foreground">
						Esta ação removerá o cliente do sistema. Deseja continuar?
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
		</PageContainer>
	);
}

function CustomerDetailsSkeleton() {
	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>

				<CardContent className="space-y-6">
					{Array.from({ length: 5 }, (_, index) => index).map((item) => (
						<div key={item} className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-5 w-48" />
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-56" />
				</CardHeader>

				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-64" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
