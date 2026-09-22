import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, ClipboardList, Users } from "lucide-react";
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
import { useCustomers } from "#/features/customers/hooks/use-customers";
import { useMotorcycles } from "#/features/motorcycles/hooks/use-motorcycles";
import { useOrders } from "#/features/orders/hooks/use-orders";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

type Stat = {
	label: string;
	value: string | number;
	icon: typeof Users;
	href: "/clientes" | "/motocicletas" | "/pedidos";
};

function DashboardPage() {
	const customers = useCustomers();
	const motorcycles = useMotorcycles();
	const orders = useOrders();

	const stats: Stat[] = [
		{
			label: "Clientes",
			value: customers.data?.total ?? "—",
			icon: Users,
			href: "/clientes",
		},
		{
			label: "Motocicletas",
			value: motorcycles.data?.total ?? "—",
			icon: Bike,
			href: "/motocicletas",
		},
		{
			label: "Pedidos",
			value: orders.data?.meta.total ?? "—",
			icon: ClipboardList,
			href: "/pedidos",
		},
	];

	return (
		<PageContainer>
			<PageHeader
				title="Dashboard"
				description="Visão geral da concessionária."
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>{stat.label}</CardTitle>
								<stat.icon className="size-4 text-muted-foreground" />
							</div>
							<CardDescription>Total cadastrado no sistema</CardDescription>
						</CardHeader>

						<CardContent>
							<p className="text-3xl font-semibold">{stat.value}</p>

							<Button
								variant="outline"
								size="sm"
								className="mt-2 w-full"
								render={<Link to={stat.href} search={{ page: 1 }} />}
							>
								Ver detalhes
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</PageContainer>
	);
}
