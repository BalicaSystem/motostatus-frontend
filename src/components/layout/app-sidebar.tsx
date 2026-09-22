import { Link } from "@tanstack/react-router";
import { Bike, ClipboardList, LayoutDashboard, Users } from "lucide-react";
import type * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";

const navigation = [
	{
		label: "Principal",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
			},
		],
	},
	{
		label: "Operação",
		items: [
			{
				title: "Clientes",
				url: "/clientes",
				icon: Users,
			},
			{
				title: "Motocicletas",
				url: "/motocicletas",
				icon: Bike,
			},
			{
				title: "Pedidos",
				url: "/pedidos",
				icon: ClipboardList,
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
							<div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm ring-1 ring-ring/50">
								<Bike className="size-4" />
							</div>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">Status Moto</span>
								<span className="truncate text-xs text-muted-foreground">
									Gestão de concessionária
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navigation.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											tooltip={item.title}
											className="transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
											render={
												<Link
													to={item.url}
													activeProps={{
														className:
															"bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm",
													}}
												/>
											}
										>
											<item.icon />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
