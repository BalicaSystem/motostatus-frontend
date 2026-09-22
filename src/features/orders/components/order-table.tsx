import {
	ArrowRight,
	Bike,
	ClipboardList,
	MoreHorizontal,
	Pencil,
} from "lucide-react";

import { openCreateDrawer } from "#/components/create-drawers";
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
import { formatDate } from "#/lib/formatDate";
import { formatDateTime } from "#/lib/formatDateTime";
import { getInitials } from "#/lib/utils";
import type { OrderListItem } from "../types/order";

type OrderTableProps = {
	orders: OrderListItem[];
	onSelect: (order: OrderListItem, mode?: "view" | "edit") => void;
};

export function OrderTable({ orders, onSelect }: OrderTableProps) {
	if (orders.length === 0) {
		return (
			<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
				<ClipboardList className="size-8 text-muted-foreground" />

				<p className="text-sm text-muted-foreground">
					Nenhum pedido registrado ainda.
				</p>

				<Button size="sm" onClick={() => openCreateDrawer("pedido")}>
					<ClipboardList className="size-4" />
					Criar primeiro pedido
				</Button>
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

						<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
							Vendedor
						</TableHead>

						<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
							Motocicletas
						</TableHead>

						<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
							Faturamento
						</TableHead>

						<TableHead className="font-mono text-[0.6rem] font-normal tracking-[0.1em] text-muted-foreground uppercase">
							Criado em
						</TableHead>

						<TableHead className="w-24" />
					</TableRow>
				</TableHeader>

				<TableBody>
					{orders.map((order) => (
						<TableRow
							key={order.id}
							className="group cursor-pointer transition-colors hover:bg-primary/[0.04]"
							onClick={() => onSelect(order)}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar className="rounded-full bg-primary/15">
										<AvatarFallback className="bg-transparent font-display text-xs font-bold text-primary">
											{getInitials(order.customer.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{order.customer.name}
										</p>

										<p className="font-mono text-[0.65rem] tracking-wider text-muted-foreground">
											{order.id.slice(0, 8).toUpperCase()}
										</p>
									</div>
								</div>
							</TableCell>

							<TableCell className="text-sm text-secondary-foreground">
								{order.seller}
							</TableCell>

							<TableCell>
								<div className="space-y-1.5">
									{order.motorcycles.map((motorcycle) => (
										<div
											key={motorcycle.id}
											className="flex items-center gap-1.5"
										>
											<Bike className="size-3.5 shrink-0 text-muted-foreground" />

											<span className="truncate text-sm font-medium text-secondary-foreground">
												{motorcycle.model}
											</span>

											<span className="hidden font-mono text-[0.65rem] tracking-wide text-muted-foreground xl:inline">
												{motorcycle.chassis}
											</span>
										</div>
									))}
								</div>
							</TableCell>

							<TableCell className="font-mono text-sm tracking-wide text-muted-foreground">
								{formatDate(order.billingDate)}
							</TableCell>

							<TableCell className="font-mono text-xs tracking-wide text-muted-foreground">
								{formatDateTime(order.createdAt)}
							</TableCell>

							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										className="size-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
										onClick={(event) => {
											event.stopPropagation();
											onSelect(order);
										}}
									>
										<ArrowRight className="size-4" />
										<span className="sr-only">Visualizar pedido</span>
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
											<span className="sr-only">Ações do pedido</span>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onSelect(order)}>
												<ArrowRight />
												Visualizar
											</DropdownMenuItem>

											<DropdownMenuItem onClick={() => onSelect(order, "edit")}>
												<Pencil />
												Editar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
