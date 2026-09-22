import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: string;
	actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 className="font-display text-3xl leading-none font-extrabold tracking-[0.03em] text-foreground uppercase md:text-4xl">
					{title}
				</h1>

				{description && (
					<p className="mt-1.5 font-mono text-xs tracking-wider text-muted-foreground">
						{description}
					</p>
				)}
			</div>

			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
}
