import { cn } from "cn";
import { Check, Copy } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { toast } from "sonner";
import { copyToClipboard } from "#/lib/utils";
import { Button } from "./ui/button";

export function DetailList({ className, ...props }: ComponentProps<"dl">) {
	return (
		<dl
			className={cn(
				"grid gap-x-8 gap-y-4 sm:grid-cols-2 [&>div]:min-w-0",
				className,
			)}
			{...props}
		/>
	);
}

type DetailFieldProps = {
	label: string;
	children: ReactNode;
	mono?: boolean;
	copyValue?: string;
	copyLabel?: string;
	className?: string;
};

export function DetailField({
	label,
	children,
	mono,
	copyValue,
	copyLabel,
	className,
}: DetailFieldProps) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!copyValue) {
			return;
		}

		const ok = await copyToClipboard(copyValue);

		if (!ok) {
			toast.error("Não foi possível copiar", {
				description: "Copie manualmente selecionando o texto.",
			});
			return;
		}

		setCopied(true);

		toast.success(copyLabel ?? "Copiado para a área de transferência");

		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className={cn("space-y-1", className)}>
			<dt className="text-sm text-muted-foreground">{label}</dt>

			<dd className="flex min-w-0 items-center gap-1.5">
				<span
					className={cn(
						"min-w-0 break-words text-sm font-medium",
						mono && "font-mono text-[13px] text-foreground/90",
					)}
				>
					{children}
				</span>

				{copyValue && (
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						className="shrink-0 text-muted-foreground"
						aria-label={`Copiar ${label}`}
						onClick={handleCopy}
					>
						{copied ? (
							<Check className="text-emerald-600" />
						) : (
							<Copy className="size-3" />
						)}
					</Button>
				)}
			</dd>
		</div>
	);
}
