import { Loader2 } from "lucide-react";

type TableSyncIndicatorProps = {
	show: boolean;
	label?: string;
};

export function TableSyncIndicator({
	show,
	label = "Carregando página...",
}: TableSyncIndicatorProps) {
	if (!show) {
		return null;
	}

	return (
		<output
			aria-live="polite"
			className="absolute inset-0 flex items-start justify-center bg-background/40 pt-4 backdrop-blur-[1px]"
		>
			<div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
				<Loader2 className="size-4 animate-spin" />
				{label}
			</div>
		</output>
	);
}
