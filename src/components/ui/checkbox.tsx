import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"peer inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className="flex items-center justify-center text-current"
				render={<CheckIcon className="size-3" />}
			/>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
