import { Link, useNavigate } from "@tanstack/react-router";
import {
	Bike,
	ClipboardList,
	LayoutDashboard,
	LogOut,
	QrCode,
	Users,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";
import { signOut } from "#/features/auth/auth-service";
import { useSessionUser } from "#/features/auth/session";

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
			{
				title: "Registrar chegada",
				url: "/motocicletas/registrar-chegada",
				icon: QrCode,
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const navigate = useNavigate();
	const user = useSessionUser();

	async function handleSignOut() {
		await signOut();

		await navigate({ to: "/login", replace: true });
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-b border-sidebar-border px-4 py-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
							<div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
								<Bike className="size-4" />
							</div>

							<div className="grid flex-1 text-left">
								<span className="truncate font-display text-base leading-none font-bold tracking-[0.06em] text-sidebar-foreground uppercase">
									Status Moto
								</span>

								<span className="mt-1 truncate font-mono text-[0.6rem] tracking-[0.12em] text-sidebar-foreground/60 uppercase">
									Gestão de concessionária
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="px-2.5 pt-3">
				{navigation.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel className="px-3 font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
							{group.label}
						</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											tooltip={item.title}
											className="gap-3 rounded-sm px-3 py-2 font-display text-sm leading-none font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
											render={
												<Link
													to={item.url}
													className="group"
													activeProps={{
														className:
															"border-l-2 border-primary bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
													}}
												/>
											}
										>
											<item.icon className="size-4 shrink-0 text-sidebar-foreground/50 group-aria-[current=page]:text-primary" />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border px-4 py-3">
				<div className="flex items-center gap-3">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary font-display text-xs font-bold text-sidebar-primary-foreground">
						{(user?.name ?? "SM").slice(0, 2).toUpperCase()}
					</div>

					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold text-sidebar-foreground">
							{user?.name ?? "Administrador"}
						</p>

						<p className="truncate font-mono text-[0.6rem] tracking-wider text-sidebar-foreground/60 uppercase">
							{user?.email ?? "Status Moto"}
						</p>
					</div>

					<SidebarMenuButton
						size="sm"
						title="Sair"
						onClick={handleSignOut}
						className="h-8 w-8 shrink-0 justify-center text-muted-foreground hover:text-destructive"
					>
						<LogOut className="size-4" />
					</SidebarMenuButton>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
