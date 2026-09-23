import { cn } from "cn";
import { Search, X } from "lucide-react";
import { Input } from "#/components/ui/input";

type SearchInputProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
};

export function SearchInput({
	value,
	onChange,
	placeholder = "Buscar...",
	className,
}: SearchInputProps) {
	return (
		<div className={cn("relative", className)}>
			<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

			<Input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="h-9 pr-9 pl-9"
			/>

			{value ? (
				<button
					type="button"
					onClick={() => onChange("")}
					aria-label="Limpar busca"
					className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
				>
					<X className="size-4" />
				</button>
			) : null}
		</div>
	);
}
