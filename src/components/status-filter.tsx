import { cn } from "cn";

export type FilterOption = {
	value: string;
	label: string;
};

type StatusFilterProps = {
	options: FilterOption[];
	value: string;
	onChange: (value: string) => void;
};

export function StatusFilter({ options, value, onChange }: StatusFilterProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => {
				const active = option.value === value;

				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"rounded border px-3 py-1.5 font-mono text-xs tracking-[0.08em] uppercase transition-all",
							active
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-card text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
