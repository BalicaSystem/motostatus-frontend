import { Link } from "@tanstack/react-router";
import { ClipboardList, Eye, MoreHorizontal, Pencil } from "lucide-react";

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
};

export function OrderTable({ orders }: OrderTableProps) {
	if (orders.length === 0) {
		return (
			<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
				<ClipboardList className="size-8 text-muted-foreground" />

				<p className="text-sm text-muted-foreground">
					Nenhum pedido registrado ainda.
				</p>

				<Button size="sm" render={<Link to="/pedidos/novo" />}>
					<ClipboardList className="size-4" />
					Criar primeiro pedido
				</Button>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Cliente</TableHead>
						<TableHead>Vendedor</TableHead>
						<TableHead>Motocicletas</TableHead>
						<TableHead>Faturamento</TableHead>
						<TableHead>Criado em</TableHead>
						<TableHead className="w-12" />
					</TableRow>
				</TableHeader>

				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials(order.customer.name)}
										</AvatarFallback>
									</Avatar>

									<div>
										<p className="font-medium">{order.customer.name}</p>

										<p className="text-xs text-muted-foreground">
											{order.customer.document}
										</p>
									</div>
								</div>
							</TableCell>

							<TableCell>{order.seller}</TableCell>

							<TableCell>
								<div className="space-y-2">
									{order.motorcycles.map((motorcycle) => (
										<div key={motorcycle.id}>
											<p className="text-sm font-medium">{motorcycle.model}</p>

											<p className="font-mono text-xs text-muted-foreground">
												{motorcycle.chassis}
											</p>
										</div>
									))}
								</div>
							</TableCell>

							<TableCell>{formatDate(order.billingDate)}</TableCell>

							<TableCell>{formatDateTime(order.createdAt)}</TableCell>

							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="ghost" size="icon" className="size-8" />
										}
									>
										<MoreHorizontal className="size-4" />

										<span className="sr-only">Ações do pedido</span>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem
											render={
												<Link
													to="/pedidos/$orderId"
													params={{ orderId: order.id }}
												/>
											}
										>
											<Eye />
											Visualizar
										</DropdownMenuItem>

										<DropdownMenuItem
											render={
												<Link
													to="/pedidos/$orderId/editar"
													params={{ orderId: order.id }}
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
