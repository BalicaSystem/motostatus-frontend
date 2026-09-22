import { CommandMenu } from "#/components/command-menu";
import { CreateDrawers } from "#/components/create-drawers";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />

			<SidebarInset>
				<AppHeader />
				{children}
			</SidebarInset>

			<CommandMenu />
			<CreateDrawers />
		</SidebarProvider>
	);
}
