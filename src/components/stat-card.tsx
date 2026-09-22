import { cn } from "cn";

import { Card, CardContent } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";

type StatCardProps = {
	label: string;
	value?: number | string;
	sub?: string;
	accent?: boolean;
	loading?: boolean;
	className?: string;
};

export function StatCard({
	label,
	value,
	sub,
	accent,
	loading,
	className,
}: StatCardProps) {
	return (
		<Card className={cn("p-5", className)}>
			<CardContent className="gap-3 p-0">
				<p className="font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
					{label}
				</p>

				{loading ? (
					<Skeleton className="h-9 w-16" />
				) : (
					<p
						className={cn(
							"font-display text-4xl leading-none font-bold tracking-[0.02em] tabular-nums",
							accent ? "text-primary" : "text-foreground",
						)}
					>
						{value ?? "—"}
					</p>
				)}

				{sub && <p className="text-xs text-muted-foreground">{sub}</p>}
			</CardContent>
		</Card>
	);
}
