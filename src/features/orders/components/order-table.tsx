import { Link } from "@tanstack/react-router";
import { Eye, MoreHorizontal } from "lucide-react";

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
import type { OrderListItem } from "../types/order";

type OrderTableProps = {
	orders: OrderListItem[];
};

export function OrderTable({ orders }: OrderTableProps) {
	if (orders.length === 0) {
		return (
			<div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
				<p className="text-sm text-muted-foreground">
					Nenhum pedido encontrado.
				</p>
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
								<div>
									<p className="font-medium">{order.customer.name}</p>

									<p className="text-xs text-muted-foreground">
										{order.customer.document}
									</p>
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
