import { ArrowUpRight, Bike, Trash2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import { formatDate } from "#/lib/formatDate";
import type { Motorcycle } from "../types/motorcycle";
import { MotorcycleStatusBadge } from "./motorcycle-status-badge";

type MotorcycleCardGridProps = {
	motorcycles: Motorcycle[];
	onSelect: (motorcycle: Motorcycle) => void;
	onDeleteRequest: (motorcycle: Motorcycle) => void;
};

export function MotorcycleCardGrid({
	motorcycles,
	onSelect,
	onDeleteRequest,
}: MotorcycleCardGridProps) {
	if (motorcycles.length === 0) {
		return (
			<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
				<Bike className="size-8 text-muted-foreground" />

				<p className="text-sm text-muted-foreground">
					Nenhuma motocicleta encontrada.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
			{motorcycles.map((motorcycle) => (
				<div
					key={motorcycle.id}
					className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
				>
					<div className="flex items-start justify-between gap-3">
						<button
							type="button"
							className="flex min-w-0 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							onClick={() => onSelect(motorcycle)}
						>
							<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
								<Bike className="size-5" />
							</span>

							<div className="min-w-0">
								<p className="truncate font-display text-base font-bold tracking-[0.03em] uppercase">
									{motorcycle.model}
								</p>

								<p className="font-mono text-[0.65rem] tracking-wider text-muted-foreground">
									Unidade {motorcycle.id}
								</p>
							</div>
						</button>

						<div className="flex shrink-0 items-center gap-1">
							<MotorcycleStatusBadge status={motorcycle.status} />

							<Button
								variant="ghost"
								size="icon-sm"
								className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
								onClick={() => onDeleteRequest(motorcycle)}
							>
								<Trash2 className="size-4" />
								<span className="sr-only">Excluir motocicleta</span>
							</Button>
						</div>
					</div>

					<button
						type="button"
						className="mt-4 grid w-full grid-cols-2 gap-3 border-t border-border pt-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						onClick={() => onSelect(motorcycle)}
					>
						<div className="col-span-2">
							<p className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
								Chassi
							</p>

							<p className="mt-1 truncate font-mono text-sm tracking-wide text-foreground">
								{motorcycle.chassis}
							</p>
						</div>

						<div>
							<p className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
								Previsão de chegada
							</p>

							<p className="mt-1 text-sm font-medium text-secondary-foreground">
								{formatDate(motorcycle.estimatedArrival)}
							</p>
						</div>

						<div className="flex items-end justify-end">
							<span className="flex items-center gap-1 font-mono text-[0.6rem] tracking-[0.12em] text-primary uppercase opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
								Abrir
								<ArrowUpRight className="size-3.5" />
							</span>
						</div>
					</button>
				</div>
			))}
		</div>
	);
}
