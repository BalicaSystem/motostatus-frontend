import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "cn";

function Avatar({
	className,
	...props
}: AvatarPrimitive.Root.Props & { size?: "sm" | "md" | "lg" }) {
	const { size = "md", ...rootProps } = props;

	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			className={cn(
				"relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-medium text-secondary-foreground select-none data-[size=lg]:size-12 data-[size=sm]:size-7 data-[size=sm]:text-xs",
				className,
			)}
			{...rootProps}
		/>
	);
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn("aspect-square size-full", className)}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: AvatarPrimitive.Fallback.Props) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"flex size-full items-center justify-center rounded-full bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
