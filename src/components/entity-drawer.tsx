import { cn } from "cn";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "#/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "#/components/ui/sheet";

type EntityDrawerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	subtitle?: string;
	footer?: ReactNode;
	width?: "default" | "wide";
	children: ReactNode;
};

export function EntityDrawer({
	open,
	onOpenChange,
	title,
	subtitle,
	footer,
	width = "default",
	children,
}: EntityDrawerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				className={cn(
					"flex max-h-dvh w-full flex-col gap-0 rounded-none border-l border-border py-0",
					width === "wide"
						? "max-w-[480px] sm:max-w-[480px]"
						: "max-w-[420px] sm:max-w-[420px]",
				)}
			>
				<SheetHeader className="flex shrink-0 flex-row items-start justify-between gap-4 border-b border-border px-5 py-4">
					<div className="min-w-0 space-y-0.5">
						<SheetTitle className="font-display text-xl leading-none font-bold tracking-[0.04em] uppercase">
							{title}
						</SheetTitle>

						{subtitle && (
							<SheetDescription className="truncate font-mono text-[0.65rem] tracking-wider">
								{subtitle}
							</SheetDescription>
						)}
					</div>

					<SheetClose
						render={
							<Button
								variant="ghost"
								size="icon-sm"
								className="-mt-1 -mr-1 shrink-0"
								aria-label="Fechar"
							/>
						}
					>
						<XIcon />
					</SheetClose>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

				{footer && (
					<div className="w-full shrink-0 border-t border-border px-5 py-4">
						{footer}
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
