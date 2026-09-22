import { cn } from "cn";
import type { ReactNode } from "react";

export function MicroLabel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"font-mono text-[0.6rem] leading-tight tracking-[0.12em] text-muted-foreground uppercase",
				className,
			)}
		>
			{children}
		</p>
	);
}

type DrawerFieldProps = {
	label: string;
	mono?: boolean;
	full?: boolean;
	children: ReactNode;
};

export function DrawerField({ label, mono, full, children }: DrawerFieldProps) {
	return (
		<div className={cn("min-w-0", full && "col-span-full")}>
			<MicroLabel>{label}</MicroLabel>

			<div
				className={cn(
					"mt-1 text-sm font-medium text-foreground",
					mono && "font-mono text-xs tracking-wide break-all",
				)}
			>
				{children || "—"}
			</div>
		</div>
	);
}
