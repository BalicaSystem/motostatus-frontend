import { Link } from "@tanstack/react-router";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";

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
			<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
				<p className="text-sm text-muted-foreground">
					Nenhuma motocicleta encontrada.
				</p>
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
							<TableCell className="font-medium">{motorcycle.model}</TableCell>

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
													to="/motocicletas/$motorcycleId"
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
