import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import { SidebarTrigger } from "#/components/ui/sidebar";

export function AppHeader() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	function toggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger
				render={<Button variant="ghost" size="icon" className="size-8" />}
			>
				<Menu className="size-4" />
				<span className="sr-only">Abrir menu</span>
			</SidebarTrigger>

			<div className="flex flex-1 items-center">
				<span className="text-sm font-medium">Status Moto</span>
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="size-8"
				disabled={!mounted}
				aria-label="Alternar tema"
				onClick={toggleTheme}
			>
				{mounted && resolvedTheme === "dark" ? (
					<Sun className="size-4" />
				) : (
					<Moon className="size-4" />
				)}
			</Button>
		</header>
	);
}
