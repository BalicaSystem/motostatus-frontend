import { cn } from "cn";

export type StatusTone =
	| "amber"
	| "emerald"
	| "sky"
	| "slate"
	| "red"
	| "orange";

const toneClasses: Record<StatusTone, string> = {
	amber:
		"border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-400",
	emerald:
		"border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400",
	orange:
		"border-orange-400/30 bg-orange-400/10 text-orange-600 dark:text-orange-400",
	red: "border-red-400/30 bg-red-400/10 text-red-600 dark:text-red-400",
	sky: "border-sky-400/30 bg-sky-400/10 text-sky-600 dark:text-sky-400",
	slate: "border-zinc-400/30 bg-zinc-400/10 text-zinc-600 dark:text-zinc-400",
};

type StatusPillProps = {
	tone: StatusTone;
	className?: string;
	children: React.ReactNode;
};

export function StatusPill({ tone, className, children }: StatusPillProps) {
	return (
		<span
			className={cn(
				"inline-flex h-fit w-fit items-center gap-1 overflow-hidden rounded border px-2 py-0.5 font-mono text-[10px] leading-tight font-medium tracking-widest whitespace-nowrap uppercase",
				toneClasses[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}
