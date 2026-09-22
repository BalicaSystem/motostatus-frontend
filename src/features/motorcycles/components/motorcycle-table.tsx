import { Link } from "@tanstack/react-router";
import { Bike, Eye, MoreHorizontal, Pencil } from "lucide-react";

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
import { formatDate } from "#/lib/formatDate";
import type { Motorcycle } from "../types/motorcycle";
import { MotorcycleStatusBadge } from "./motorcycle-status-badge";

type MotorcycleTableProps = {
	motorcycles: Motorcycle[];
};

export function MotorcycleTable({ motorcycles }: MotorcycleTableProps) {
	if (motorcycles.length === 0) {
		return (
			<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
				<Bike className="size-8 text-muted-foreground" />

				<p className="text-sm text-muted-foreground">
					Nenhuma motocicleta encontrada.
				</p>

				<Button
					variant="outline"
					size="sm"
					render={<Link to="/motocicletas/nova" />}
				>
					<Bike className="size-4" />
					Cadastrar motocicleta
				</Button>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Modelo</TableHead>
						<TableHead>Chassi</TableHead>
						<TableHead>Previsão de chegada</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-12" />
					</TableRow>
				</TableHeader>

				<TableBody>
					{motorcycles.map((motorcycle) => (
						<TableRow key={motorcycle.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
										<Bike className="size-4" />
									</span>

									<span className="font-medium">{motorcycle.model}</span>
								</div>
							</TableCell>

							<TableCell className="font-mono text-sm">
								{motorcycle.chassis}
							</TableCell>

							<TableCell>{formatDate(motorcycle.estimatedArrival)}</TableCell>

							<TableCell>
								<MotorcycleStatusBadge status={motorcycle.status} />
							</TableCell>

							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="ghost" size="icon" className="size-8" />
										}
									>
										<MoreHorizontal className="size-4" />
										<span className="sr-only">Ações da motocicleta</span>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem
											render={
												<Link
													to="/motocicletas/$motorcycleId"
													params={{ motorcycleId: motorcycle.id }}
												/>
											}
										>
											<Eye />
											Visualizar
										</DropdownMenuItem>

										<DropdownMenuItem
											render={
												<Link
													to="/motocicletas/$motorcycleId/editar"
													params={{ motorcycleId: motorcycle.id }}
												/>
											}
										>
											<Pencil />
											Editar
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
