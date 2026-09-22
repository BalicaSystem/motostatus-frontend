import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { PageContainer } from "#/components/layout/page-container";
import { PageHeader } from "#/components/layout/page-header";
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
import { MotorcycleStatusBadge } from "#/features/motorcycles/components/motorcycle-status-badge";
import { useMotorcycle } from "#/features/motorcycles/hooks/use-motorcycle";
import { formatDate } from "#/lib/formatDate";

export const Route = createFileRoute("/motocicletas/$motorcycleId/")({
	component: MotorcycleDetailsPage,
});

function MotorcycleDetailsPage() {
	const { motorcycleId } = Route.useParams();
	const { data, isLoading, isError } = useMotorcycle(motorcycleId);

	if (isLoading) {
		return (
			<PageContainer>
				<PageHeader
					title="Motocicleta"
					description="Visualização dos dados da motocicleta."
				/>

				<MotorcycleDetailsSkeleton />
			</PageContainer>
		);
	}

	if (isError || !data) {
		return (
			<PageContainer>
				<PageHeader
					title="Motocicleta"
					description="Visualização dos dados da motocicleta."
				/>

				<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
					<p className="text-sm text-muted-foreground">
						Não foi possível carregar a motocicleta.
					</p>
				</div>
			</PageContainer>
		);
	}

	const { motorcycle } = data;

	return (
		<PageContainer>
			<PageHeader
				title={motorcycle.model}
				description="Visualização dos dados da motocicleta."
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/motocicletas" search={{ page: 1 }} />}
						>
							<ArrowLeft className="size-4" />
							Voltar
						</Button>

						<Button
							nativeButton={false}
							render={
								<Link
									to="/motocicletas/$motorcycleId/editar"
									params={{ motorcycleId: motorcycle.id }}
								/>
							}
						>
							<Pencil className="size-4" />
							Editar
						</Button>
					</div>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Dados da motocicleta</CardTitle>
						<CardDescription>
							Informações cadastradas no estoque.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">
						<div>
							<p className="text-sm text-muted-foreground">Modelo</p>
							<p className="font-medium">{motorcycle.model}</p>
						</div>

						<div>
							<p className="text-sm text-muted-foreground">Chassi</p>
							<p className="font-mono text-sm">{motorcycle.chassis}</p>
						</div>

						<Separator />

						<div>
							<p className="text-sm text-muted-foreground">
								Previsão de chegada
							</p>
							<p className="font-medium">
								{formatDate(motorcycle.estimatedArrival)}
							</p>
						</div>

						<div>
							<p className="text-sm text-muted-foreground">Status</p>

							<div className="pt-1">
								<MotorcycleStatusBadge status={motorcycle.status} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Status da chegada</CardTitle>
						<CardDescription>
							Situação atual da motocicleta no estoque.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							<div className="flex items-start gap-3">
								<div className="mt-1 size-2 rounded-full bg-primary" />

								<div>
									<p className="font-medium">Status atual</p>
									<p className="text-sm text-muted-foreground">
										<MotorcycleStatusBadge status={motorcycle.status} />
									</p>
								</div>
							</div>

							<Separator />

							<div>
								<p className="text-sm text-muted-foreground">Identificador</p>
								<p className="break-all font-mono text-xs">{motorcycle.id}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	);
}

function MotorcycleDetailsSkeleton() {
	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-44" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>

				<CardContent className="space-y-6">
					{Array.from({ length: 4 }, (_, index) => index).map((item) => (
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

				<CardContent className="space-y-6">
					<div className="space-y-3">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>

					<Separator />

					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-64" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
